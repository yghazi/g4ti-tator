/**
 * Created by geek007 on 12/22/16.
 */
'use strict';
app.controller("landingController", function ($scope, api, $uibModal) {

    var $ctrl = this;

    $scope.open = function () {
        var options = {
            animation: true,
            templateUrl: 'app/views/landing/uploadtemplate.html',
            //size: 'lg',
            controller: function ($scope, $uibModalInstance, api, $location) {
                $scope.uploadbtn = false;
                $scope.loading =  false;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };

                $scope.ok = function () {
                    $uibModalInstance.close();
                };
                $scope.uploadError = false;
                $scope.upload = function () {
                    $scope.uploadError = false;
                    $scope.message = "";
                    $scope.loading = true;
                    var fd = new FormData();
                    fd.append('file', $scope.file);
                    fd.set("Content-Type", "multipart/form-data")
                    var success = function (response) {
                        if(response.status == 200) {
                            api.setDocument(response.data);
                            $scope.loading = false;
                            $scope.ok();
                            $location.path("/home")
                        }else{
                            $scope.uploadError = true;
                            $scope.loading = false;
                            $scope.message = "Something went went wrong while uploading document!";
                        }


                    }
                    var error = function (error) {
                        $scope.uploadError = true;
                        $scope.loading = false;
                        $scope.message = "Something went went wrong while uploading document!";
                    }
                    api.fileUpload("content/upload", fd, success, error)

                }

                $scope.$watch('file', function (newval, oldval) {
                    console.log(typeof newval);
                    if(typeof newval == "object") {
                        $scope.uploadbtn = true;
                    }else {
                        $scope.uploadbtn = false;
                    }
                })
            }
        };
        $uibModal.open(options);


    }


});
