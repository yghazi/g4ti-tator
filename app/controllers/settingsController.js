/**
 * Created by geek007 on 3/15/17.
 */
'use strict';

app.controller('setting_controller', function($scope, api){
    $scope.auth_code = "";
    $scope.auth_url = false;
    $scope.error_message =  false;
    $scope.get_auth_url = function () {
        $scope.loading = true;

        api.get('oauth-url', function(response){
            $scope.loading = false;
            if(response.status == 200) {
                $scope.auth_url = response.data;
            }else{
                $scope.error_message = "Please try again!";
            }
        }, function(err){
            $scope.loading = false;
        });
        //$scope.auth_url = "https://accounts.google.com/o/oauth2/auth?approval_prompt=force&client_id=85549371985-mkjd0jrplajdidk6554uskmj4pc6eoig.apps.googleusercontent.com&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&response_type=code&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob";
    };
    $scope.get_auth_url();

    $scope.submit_code = function () {
        $scope.loading = true;
        $scope.error_message =  false;
        if($scope.auth_code.trim() != ""){
            $scope.auth_code = $scope.auth_code.trim();
            api.post('oauth-code', $scope.auth_code , function(res){
               if(res.status == 200){
                    $scope.success_message = "Code updated successfully!";
               }
                $scope.loading = false;
            }, function (err) {
                $scope.loading = false;
                console.log(err)
            } )
        }else{
            $scope.error_message = "Auth code cannot be empty!";
        }
    }
});

