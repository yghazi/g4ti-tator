'use strict';
app.controller('homeController', function ($scope, $http, config, api, $uibModal, tag) {
    $scope.allTags = [];
    $scope.data = api.getDocument();

    var data =  $scope.data;
    var selectedText = "";

    $scope.$watch('selectedText', function(newValue, oldValue){

        if(typeof newValue != "undefined" && newValue != ""){
            selectedText = newValue;
            $scope.open();
        }
    });




    $scope.open = function () {
        var options = {
            animation: true,
            templateUrl: 'app/views/home/tag.html',
            controller: function ($scope, $uibModalInstance, api, $location) {
                console.log("hello")
                $scope.suggestedTags = [];
                if(data.hasOwnProperty("tags")) {
                    $scope.suggestedTags = data.tags;
                }
                $scope.selectedText = selectedText;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };

                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.addTag = function(){
                    if(!tag.add($scope.selectedText, $scope.currentTag)){
                        $scope.prevTag  = tag.getAll()[$scope.selectedText];

                    }
                }



            }
        };
        $uibModal.open(options);


    };







    function getSelectedText(_editor) {
        $scope.selectedText = "";
        $scope.$apply();
        $scope.selectedText = _editor.getSession().doc.getTextRange(_editor.selection.getRange());
        $scope.$apply();
    }





    $scope.aceLoaded = function (_editor) {

        _editor.setOption("showPrintMargin", false)
        _editor.setWrapBehavioursEnabled(true);
        _editor.setShowInvisibles(false);
        _editor.setFontSize(20);
        _editor.getSession().setTabSize(0);
        _editor.getSession().setUseWrapMode(true);

        _editor.renderer.setShowGutter(false);
        _editor.container.style.lineHeight = 2
        _editor.renderer.updateFontSize()

        if ($scope.data != null && $scope.data.hasOwnProperty("document")) {
            var content = tag.highlight($scope.data.tags, $scope.data.document);


            _editor.setValue($scope.data.document);

            var keywords = [];

            $scope.data.tags.forEach(function(tag){
                var text = Object.keys(tag)[0];
                keywords.push(text);

            })

            keywords = new RegExp(keywords.join("|"),"g");

            _editor.findAll(keywords,{
                //caseSensitive: false,
                //wholeWord: true,
                regExp: true
            });

        }

        //
        //contextmenu
        _editor.container.addEventListener('dblclick', function (e) {
            e.preventDefault();
            getSelectedText(_editor);
            return false;
        }, false);

        _editor.container.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            getSelectedText(_editor);
            return false;
        }, false);


        _editor.commands.addCommand({
            name: 'addTag',
            bindKey: {win: 'Ctrl-M',  mac: 'Command-M'},
            exec: function(editor) {
                getSelectedText(_editor)
            }
        });
        _editor.commands.addCommand({
            name: 'myCommand',
            bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
            exec: function(editor) {
                getSelectedText(_editor)
            }
        });

    };


    $scope.submit_document = function () {
        var data = {
            document: $scope.data.document,
            tags: tag.getAll()
        };
        var success = function(response){

        };

        var error  = function(error){

        }
        var headers = {
           "Content-Type":"application/json"
        }
        api.post("annotator/annotate", data , success, error, headers);

    };


    $scope.export = function () {
        var data = {
            document: $scope.rawText,
            tags: $scope.jsonTags
        };
        var request = {
            url: config.api.url + "annotator/annotate",
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(request).then(function (res) {

            var file = new Blob([res.data.data], {
                type: 'application/tsv'
            });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = res.data.file;
            document.body.appendChild(a);
            a.click();
        })
    }
});