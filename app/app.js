var app = angular.module("annotator-app",['ngRoute','ngAnimate']);

app.config(function($routeProvider){
	$routeProvider
		.when("/home",{
			templateUrl:"app/views/home/index.html",
			controller:"homeController"
		})
		.otherwise({redirectTo:'/home'})
})