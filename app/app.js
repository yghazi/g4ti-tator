'use strict';
var app = angular.module("tator-app",['ngRoute','ngAnimate','ui.bootstrap','ngSanitize']);

app.config(function($routeProvider){

    //$qProvider.errorOnUnhandledRejections(false);
	$routeProvider
		.when("/testing/",{
			templateUrl: "app/views/landing/testing.html",
			controller: "testingController"
		})
		.when("/home",{
			templateUrl:"app/views/document/document.html",
			controller:"documentController"
		})
        .when("/setting/",{
            templateUrl:"app/views/setting/index.html",
            controller:"setting_controller"
        })
		.when("/traningset/",{
			templateUrl: "app/views/ts/edit.html",
			controller: "editController"
		})	
		.when("/",{
			templateUrl: "app/views/landing/landing.html",
			controller: "landingController"
		})
		.otherwise({redirectTo:'/'})
})