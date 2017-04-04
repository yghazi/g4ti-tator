/**
 * Created by geek007 on 1/7/17.
 */
'use strict';
app.controller('documentController', function ($scope, $http, config, api, $uibModal, tag, $sce, $rootScope) {
    $scope.allTags = [];
    $scope.tagObj = tag

    $scope.data = api.getDocument();
    var selectedText = "";
    var allowed_tags = [];
    var data = $scope.data;

    $scope.sort = function(obj){

        var sortable = [];
        for (var item in obj) {
            sortable.push([item, obj[item].count, obj[item].color]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        return sortable;

    }


    $scope.remove_tag = function(text){
        console.log(text)
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
                    
                    var doc = $('.editor_wpr').html();
                    $rootScope.full_document = $sce.trustAsHtml(doc);
                    
                    var key = $scope.currentTag.tag;
                    var label = $scope.currentTag.name;
                    var wordParts = $scope.selectedText.split(' ');
                    var nextwords = [];
                    if (wordParts.length > 1) {
                        nextwords = wordParts.slice(1)
                    }

                    var meta = tag.highlight(key);

                    tag.stats(label, meta[1]);

                    tag.add(wordParts[0], nextwords, key);
                    var word = '<span tag="'+key+'" style="background-color:' + meta[1] + '" class="text-highlight" title="' + label + '">' + $scope.selectedText + ' <i class="glyphicon glyphicon-remove-circle remove_tag"></i></span>';
                    var text = $rootScope.full_document.$$unwrapTrustedValue();
                    var pat_text = $scope.selectedText;

                    pat_text = tag.escapeRegExp(pat_text);
                    pat_text = pat_text.concat("\\b");
                    //console.log(pat_text)
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
    $scope.$watch('data', function () {
        if ($scope.data != null && $scope.data.hasOwnProperty("document")) {
            $rootScope.full_document = $sce.trustAsHtml($scope.buildDocument());
        }
    });

    $scope.annotated_words = {}
    $scope.add_annotated_word = function (parent_word, nextword, tag) {

        if (!$scope.annotated_words.hasOwnProperty(parent_word)) {
            if (allowed_tags.indexOf(tag) < 0) {
                allowed_tags.push(tag)
            }
            $scope.annotated_words[parent_word] = {
                tag: tag,
                nextword: []
            }
        } else {
            if (parent_word != nextword) {
                var nextwords = $scope.annotated_words[parent_word]['nextword'];
                if (nextwords.indexOf(nextword) < 0) {
                    $scope.annotated_words[parent_word]['nextword'].push(nextword)
                }
            }

        }
    };

    $scope.highlight = tag.highlight;
    $scope.add = tag.add;
    $scope.buildDocument = function () {
        var docString = "";
        var parent_word = "";
        if ($scope.data.hasOwnProperty('tags')) {
            var len = $scope.data.tags.length;
            var tagsData = $scope.data.tags;

            for (var i = 0; i < len; i++) {
                var item = tagsData[i];
                var word = item[0];
                var tagName = item[2];
                if (tagName != "O") {
                    var meta = $scope.highlight(tagName);
                    if (parent_word == "") {
                        parent_word = item[0];
                    }

                    for (var j = i + 1; j < i + 2; j++) {
                        if (j in tagsData) {
                            var inner = tagsData[j];
                            if (inner[2] == 'O') {
                                break;
                            }
                            var metaInner = $scope.highlight(inner[2]);
                            if (metaInner[0] == meta[0]) {
                                $scope.add(parent_word, inner[0], meta[0]);
                                word += ' ' + inner[0];
                                i = j;
                            }
                        }

                    }

                    tag.stats(meta[0], meta[1])
                    $scope.add(parent_word, word, meta[0]);

                    word = '<span tag="" style="background-color:' + meta[1] + '" class="text-highlight" title="' + meta[0] + '">' + word + ' <i class="glyphicon glyphicon-remove-circle"></i></span>';
                } else {
                    parent_word = "";
                }

                if (word == ".") {
                    docString += word + "\n";
                } else if (word == ',') {
                    docString += word;
                } else {
                    docString += " " + word;
                }
                word = "";

            }
        } else {
            docString = $scope.data.document;
        }

        $scope.tags = tag.getStats();
        return docString;
    };

    $scope.traindata = function () {
        console.log($scope.tagObj.getAll());
        var doc = $('.editor_wpr').text();
        var data = {
            text: doc,
            metadata: $scope.tagObj.getAll()
        };
        var success = function (response) {

        };

        var error = function (error) {

        }
        var headers = {
            "Content-Type": "application/json"
        }
        api.post("train/", data, success, error, headers);
    };

    $scope.fontsize = function (input) {
        if (input == "i") {
            var font_size = postarseInt($(".editor_wpr").css("font-size"));
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
        var old_text =  item.text();
        var label = item.attr('title');
        var key = item.attr('tag');
        var withHtml = item[0].outerHTML
        var editor_html = $(".editor_wpr").html();
        var remove_pattern = new RegExp(withHtml,'g');
        $(".editor_wpr").html(editor_html.replace(remove_pattern, old_text));
        tag.remove_from_stats(label)
        tag.remove_from_tags(old_text.trim())
        $scope.$apply();
    })
});
