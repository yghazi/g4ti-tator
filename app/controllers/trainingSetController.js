'use strict';

app.controller("editController",function($scope, $sce,tag, $uibModal, $rootScope, config, api){

	$scope.output = "";
	var selectedText = "";
	$scope.spltByTab = function(str){
		return str.split(/\t/);
	}


	$scope.open = function () {
        var options = {
            animation: true,
            templateUrl: 'app/views/home/tag.html',
            controller: function ($scope, $uibModalInstance, tag, api, $location, $rootScope) {
                $scope.suggestedTags = JSON.parse(tag.getAllowedTags());

                $scope.selectedText = selectedText;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };


                $scope.ok = function () {
                    $uibModalInstance.close();
                };




                $scope.addTag = function () {
                    
                    function decodeHtml(html) {
                        var txt = document.createElement("textarea");
                        txt.innerHTML = html;
                        return txt.value;
                    }
                    var doc = unescape($('.editor_wpr').html());
                    $rootScope.full_document = $sce.trustAsHtml(doc);
                    
                    var key = $scope.currentTag.tag;
                    var label = $scope.currentTag.name;
                    var wordParts = $scope.selectedText.trim().split(' ');

                    var keyword = "";
                    var nextwords = [];
                    if (wordParts.length > 1) {

                        nextwords = wordParts.slice(1)
                    }

                    var meta = tag.highlight(key);

                    tag.stats(label, meta[1]);

                    tag.add(wordParts[0], nextwords, key);
                    var word = '<span tag="'+key+'" style="background-color:' + meta[1] + '" class="text-highlight" title="' + label + '">' + $scope.selectedText + '<i class="glyphicon glyphicon-remove-circle remove_tag"></i></span>';
                    var text = decodeHtml($rootScope.full_document.$$unwrapTrustedValue());
                    var pat_text = $scope.selectedText;
                    pat_text = tag.escapeRegExp(pat_text);
                    pat_text = pat_text.concat("(?!\<i)");
                    
                    var pattern = new RegExp(pat_text, 'g');
                    var updated_text = text.replace(pattern, word);
                    $rootScope.full_document = $sce.trustAsHtml(updated_text);
                    $scope.ok();
                }


            }
        };
        $uibModal.open(options);


    };


    $scope.getSelectionText = function () {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        if (text != "") {
            selectedText = text;
            $scope.selectedText = selectedText;
        }
    };


    $scope.$watch('selectedText', function (newval, oldval) {
        if (newval != oldval) {
            $scope.open();
            $scope.tags = tag.getStats();
        }
    });



	$scope.$watch('file', function (newval, oldval) {
        if(typeof newval != "undefined"){
        	
        	var r = new FileReader();
		    
		    r.onload = function(e) { 
			      var text = e.target.result;
			      var lines = text.split(/[\r\n]+/g)
			      let output = "";
			      let m;
			      let tagged_words = [];

			      lines.forEach(function(line, i){
			      	m  = $scope.spltByTab(line)
			      	let match = m[0];
			      	let tg = m[2];

			      	if(tg != "O"){
			      		tagged_words.push([match, tg]);
			      	}

			      	output += match;	
			    	
			    	if(match =="."){
			    		output += "<br />";
			    	}else{

			    		if(i+1 in lines){
			    			m  = $scope.spltByTab(lines[i+1])
			    			if(m[0] != ","){
			    				output += "&nbsp;";
			    			}
			    		}else{
			    			output += "&nbsp;";
			    		}
			    		
			        }
			      	
			      });
			      
			     
			      let test = [];
			      for(let i=0; i< tagged_words.length; i++){
			      	let item = tagged_words[i];
			      	if(item.length == 2){
			      		let ws_to_hgihlight =  item[0];
			      		let nextwords = [];
			      		for(let j=i+1; j< tagged_words.length; j++){
			      			let nitem = tagged_words[j];
							if(nitem.length == 2){
								if(nitem[1] != undefined && !nitem[1].startsWith("I-")){
									break;
								}
								nextwords.push(nitem[0])
								ws_to_hgihlight += "&nbsp;"+ nitem[0]
								i = j
							}			      			
			      		}
			      		tag.add(item[0], nextwords, item[1]);
			      		let pat_text = ws_to_hgihlight.concat("(?!\<i)")
                    	let pattern = new RegExp(pat_text, 'g');
                    	let p = tag.highlight(item[1])
                    	output = output.replace(pattern, '<span class="text-highlight" style="background:'+p[1]+'" title="'+ p[0]+'">'+ ws_to_hgihlight +'<i class="glyphicon glyphicon-remove-circle remove_tag" title="remove tag"></i></span>')
			      		test.push([ws_to_hgihlight, item[1]])
			      	}

			      }
			      
			      $rootScope.full_document = $sce.trustAsHtml(output);


			      $scope.tagged_words = test
			      $scope.$apply()
		        
		      }
		    r.readAsText(newval);
        	//r.readAsArrayBuffer(newval)
        }
                    
    });

    $scope.traindata = function () {
        var doc = $('.editor_wpr').text();
        var data = {
            text: doc,
            metadata: tag.getAll()
        };
        var success = function (response) {

        };

        var error = function (error) {

        }
        var headers = {
            "Content-Type": "application/json"
        }
        console.log(data);
        api.post("train/", data, success, error, headers);
    };

    $scope.fontsize = function (input) {
        if (input == "i") {
            var font_size = parseInt($(".editor_wpr").css("font-size"));
            if (font_size < 60) {
                $(".editor_wpr").css("font-size", ++font_size);
            }
        }
        if (input == "d") {
            var font_size = parseInt($(".editor_wpr").css("font-size"));
            if (font_size > 12) {
                $(".editor_wpr").css("font-size", --font_size);
            }
        }

    }

    $(".editor_wpr").on('click','.remove_tag', function(){
        var item = $(this).closest('span');
        var old_text =  item.text().trim();
        var label = item.attr('title');
        var key = item.attr('tag');
        var withHtml = item[0].outerHTML
        var editor_html = $(".editor_wpr").html();
        var remove_pattern = new RegExp(withHtml,'g');
        $(".editor_wpr").html(editor_html.replace(remove_pattern, old_text));
        $scope.$apply();
        tag.remove_from_stats(label)
        tag.remove_from_tags(old_text)
        $scope.$apply();
    })
})