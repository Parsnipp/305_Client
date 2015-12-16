/* 	
		when an action happens in index.html this file will handle that action 
		sending the requests to the relevant functions or files 
    'Access-Control-Allow-Origin': 'http://localhost:8080', 
*/

const recipeApp = angular.module('recipeApp', ['ngRoute']);

recipeApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/getAll', {
  		templateUrl: 'templates/getAll.html',
  		controller: 'getAllController'
  	})
  	.when('/getItem/:id', {
  		templateUrl: 'templates/getItem.html',
  		controller: 'getItemController'
  	})
  	.when('/getRemoteItem/:id', {
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
		.when('/remove', {
			templateUrl: 'templates/remove.html',
			controller: 'removeController'
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
		.when('/remove_account', {
			templateUrl: 'templates/remove_account.html',
			controller: 'removeAccountController'
		})
		.otherwise({
		  redirectTo: 'getAll'
		});
}]);

recipeApp.controller('getAllController', function($scope, $http) {
  $http({
    method: 'GET',
    url: 'http://localhost:8080/'
  }).then(function successCallback(response) {
      console.log(response.data.data);
      $scope.recipes = response.data.data;
    }, function errorCallback(response) {
      console.log(response);
    });
  
  $scope.login = function() {
    const url = 'http://localhost:8080/user';
    const auth = 'Basic '+btoa('testuser:password');
    console.log(auth);
    $http({
      method: 'GET',
      url: url,
      headers: {'Authorization': auth}
    }).then(function successCallback(response) {
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
  }
});

recipeApp.controller('getItemController', function($scope, $http, $routeParams) {
  const url = 'http://localhost:8080/recipes/'+$routeParams.id;
  console.log(url);
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      var json = JSON.parse(response.data.data);
      $scope.recipe = json[0];
    }, function errorCallback(response) {
      console.log(response);
    });
});

recipeApp.controller('getRemoteItemController', function($scope, $http, $routeParams) {
  console.log($routeParams);
  const url = 'http://localhost:8080/recipes/remote/'+$routeParams.id;
  console.log(url);
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      $scope.recipe = response.data.data;
    }, function errorCallback(response) {
      console.log(response);
    });
});

recipeApp.controller('searchController', function($scope, $http) {
  $scope.search = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:8080/recipes/search/'+$scope.search.term
    }).then(function successCallback(response) {
        console.log(response.data);
        $scope.recipes = response.data.data;
      }, function errorCallback(response) {
        console.log(response);
      });
  };
});

recipeApp.controller('postController', function($scope, $http) {
  var ingredients = [];
  $scope.add = function() {
    ingredients.push($scope.recipe.ingredients);
    $scope.ingredients = ingredients;
    $scope.recipe.ingredients = null;
  };
  
  $scope.submit = function() {
    const url = 'http://localhost:8080/recipes';
    const json = {"name": $scope.recipe.name, "ingredients": $scope.ingredients, "directions": $scope.recipe.directions};
    const stringJSON = JSON.stringify(json);
    console.log(stringJSON);
    const auth = 'Basic '+btoa('testuser:password');
    $http({
      method: 'POST',
      url: url,
      headers: {'Authorization': auth, 'Content-Type': 'text'},
      data: json
    }).then(function successCallback(response) {
      console.log(response);
      $scope.message = 'Recipe saved';
      $scope.recipe.name = null;
      $scope.recipe.ingredients = null;
      $scope.recipe.directions = null;
      $scope.ingredients = null;
    }, function errorCallback(response) {
      console.log(response);
      $scope.message = 'You must be logged in to save a recipe';
    });
  };
});

recipeApp.controller('putController', function($scope) {

});

recipeApp.controller('removeController', function($scope) {

});

recipeApp.controller('accountController', function($scope, $http) {

});

recipeApp.controller('createAccountController', function($scope) {

});

recipeApp.controller('updateAccountController', function($scope) {

});

recipeApp.controller('removeAccountController', function($scope) {

});