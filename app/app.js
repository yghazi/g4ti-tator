var app = angular.module("tator-app",['ngRoute','ngAnimate','ui.bootstrap','ngSanitize']);

app.config(function($routeProvider){

    //$qProvider.errorOnUnhandledRejections(false);
	$routeProvider
		.when("/home",{
			templateUrl:"app/views/document/document.html",
			controller:"documentController"
		})
		.when("/",{
			templateUrl: "app/views/landing/landing.html",
			controller: "landingController"
		})
		.otherwise({redirectTo:'/'})
})