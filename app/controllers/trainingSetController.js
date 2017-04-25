'use strict';

app.controller("editController",function($scope, $sce,tag){

	$scope.output = "";

	$scope.spltByTab = function(str){
		return str.split(/\t/);
	}

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

			      		for(let j=i+1; j< tagged_words.length; j++){
			      			let nitem = tagged_words[j];
							if(nitem.length == 2){
								if(!nitem[1].startsWith("I-")){
									break;
								}
								ws_to_hgihlight += "&nbsp;"+ nitem[0]
								i = j
							}			      			
			      		}
			      		let pat_text = ws_to_hgihlight.concat("(?!\<i)")
                    	let pattern = new RegExp(pat_text, 'g');
                    	let p = tag.highlight(item[1])
                    	output = output.replace(pattern, '<span class="text-highlight" style="background:'+p[1]+'" title="'+ p[0]+'">'+ ws_to_hgihlight +'<i class="glyphicon glyphicon-remove-circle remove_tag" title="remove tag"></i></span>')
			      		test.push([ws_to_hgihlight, item[1]])
			      	}

			      }
			      
			      $scope.output = $sce.trustAsHtml(output);


			      $scope.tagged_words = test
			      $scope.$apply()
		        
		      }
		    r.readAsText(newval);
        	//r.readAsArrayBuffer(newval)
        }
                    
    })
})