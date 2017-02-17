/**
 * Created by geek007 on 1/7/17.
 */
'use strict';
app.controller('documentController', function ($scope, $http, config, api, $uibModal, tag, $sce) {
    $scope.allTags = [];
    $scope.tagObj = tag

    $scope.data = api.getDocument();
    var selectedText = "";
    var allowed_tags = [];
    var data = $scope.data;

    $scope.open = function () {
        var options = {
            animation: true,
            templateUrl: 'app/views/home/tag.html',
            controller: function ($scope, $uibModalInstance, tag, api, $location) {
                $scope.suggestedTags = tag.getAllowedTags();

                $scope.selectedText = selectedText;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };

                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.addTag = function () {

                    tag.add($scope.selectedText, "", $scope.currentTag);
                    console.log("Tag is added")
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
        }
    });


    $scope.$watch('data', function () {
        if ($scope.data != null && $scope.data.hasOwnProperty("document")) {
            $scope.full_document = $sce.trustAsHtml($scope.buildDocument());
        }
    });

    $scope.annotated_words = {}


    $scope.add_annotated_word = function (parent_word, nextword, tag) {

        if (!$scope.annotated_words.hasOwnProperty(parent_word)) {
            if(allowed_tags.indexOf(tag) < 0) {
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
        $scope.data.tags.forEach(function (item) {

            var word = item[0];
            var tagName = item[2];

            if (tagName != "O") {
                var meta = $scope.highlight(tagName);
                if (parent_word == "") {
                    parent_word = item[0];
                }
                $scope.add(parent_word, word, meta[0]);
                word = '<span style="background-color:' + meta[1] + '" class="text-highlight" title="' + meta[0] + '">' + word + '</span>';
            } else {
                parent_word = "";
            }

            if (word == ".") {
                docString += word + "\n";
            }
            else if(word == ','){
                docString += word;
            }
            else {
                docString += " " + word;
            }
            word = "";
            tag = "";
        });
        return docString;
    };

    $scope.traindata = function () {
        console.log($scope.tagObj.getAll());
        var doc = $('.editor_wpr').text();
        var data = {
            text: doc,
            metadata: $scope.tagObj.getAll()
        };
        var success = function(response){

        };

        var error  = function(error){

        }
        var headers = {
            "Content-Type":"application/json"
        }
        api.post("train/", data , success, error, headers);
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


});