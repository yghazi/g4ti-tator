/**
 * Created by geek007 on 12/22/16.
 */
'use strict';
app.service('api', ['$http', 'config', function ($http, config) {
    this.get = function (url, suceesscb, errcb, headers) {
        var request = {
            url: config.api.url + url,
            method: 'GET',
            headers: headers
        }
        $http(request).then(suceesscb, errcb);
    }

    this.post = function (url, data, suceesscb, errcb, headers) {
        var request = {
            url: config.api.url + url,
            method: 'POST',
            headers: headers,
            data: data
        }
        $http(request).then(suceesscb, errcb);
    }

    this.fileUpload = function (url, data, successcb, errorcb) {
        var uploadUrl = config.api.url + url;
        $http.post(uploadUrl, data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(successcb, errorcb);
    }


    var document = null;
    this.getDocument = function(){
        return document;
    }

    this.setDocument = function(content){
        document =  content;
    }
}])