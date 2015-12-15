/* 	
		when an action happens in index.html this file will handle that action 
		sending the requests to the relevant functions or files 
*/

var recipeApp = angular.module('recipeApp', ['ngRoute']);
var user = angular.module('headerApp', ['ngRoute']);

recipeApp.config( ['$routeProvider', ($routeProvider) => {
  $routeProvider
  	.when('/getAll', {
  		templateUrl: 'templates/getAll.html',
  		controller: 'getAllController'
  	})
  	.when('/getItem', {
  		templateUrl: 'templates/getItem.html',
  		controller: 'getItemController'
  	})
  	.when('/getRemoteItem', {
  		templateUrl: 'templates/getRemoteItem.html',
  		controller: 'getRemoteItemController'
  	})
    .when('/search', {
		  templateUrl: 'templates/search.html',
      controller: 'searchController'
		})
		.when('/post', {
			templateUrl: 'templates/post.html',
			controller: 'postController'
		})
		.when('/put', {
			templateUrl: 'templates/put.html',
			controller: 'putController'
		})
		.when('/delete', {
			templateUrl: 'templates/delete.html',
			controller: 'deleteController'
		})
		.when('/account', {
			templateUrl: 'templates/account.html',
			controller: 'accountController'
		})
		.when('/create_account', {
			templateUrl: 'templates/create_account.html',
			controller: 'createAccountController'
		})
		.when('/update_account', {
			templateUrl: 'templates/update_account.html',
			controller: 'updateAccountController'
		})
		.when('/delete_account', {
			templateUrl: 'templates/delete_account.html',
			controller: 'deleteAccountController'
		})
		.otherwise({
		  redirectTo: 'getAll'
		});
}]);

recipeApp.controller('getAllController', ($scope, $http) => {

});

recipeApp.controller('getItemController', ($scope) => {

});

recipeApp.controller('getRemoteItemController', ($scope) => {

});

recipeApp.controller('searchController', ($scope) => {

});

recipeApp.controller('postController', ($scope) => {

});

recipeApp.controller('putController', ($scope) => {

});

recipeApp.controller('deleteController', ($scope) => {

});

recipeApp.controller('accountController', ($scope) => {

});

recipeApp.controller('createAccountController', ($scope) => {

});

recipeApp.controller('updateAccountController', ($scope) => {

});

recipeApp.controller('deleteAccountController', ($scope) => {

});