/* 	
		when an action happens in index.html this file will handle that action 
		sending the requests to the relevant functions or files 
    'Access-Control-Allow-Origin': 'http://localhost:8080', 
*/

const recipeApp = angular.module('recipeApp', ['ngRoute', 'ngCookies']);
var user;
var loginTemplate = 'templates/login.html';

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
		.when('/put/:id', {
			templateUrl: 'templates/put.html',
			controller: 'putController'
		})
		.when('/remove/:id', {
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

recipeApp.controller('getAllController', function($scope, $http, $cookies) {
  console.log($cookies.getAll());
  $http({
    method: 'GET',
    url: 'http://localhost:8080/'
  }).then(function successCallback(response) {
      console.log(response.data.data);
      $scope.recipes = response.data.data;
    }, function errorCallback(response) {
      console.log(response);
    });
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
      $scope.deleter = {_id: json[0]._id, name: json[0].name};
      console.log($scope.deleter);
    }, function errorCallback(response) {
      console.log(response);
    });
});

recipeApp.controller('getRemoteItemController', function($scope, $http, $routeParams) {
  const url = 'http://localhost:8080/recipes/remote/'+$routeParams.id;
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
    $http({
      method: 'POST',
      url: url,
      headers: {'Authorization': 'Basic '+user, 'Content-Type': 'text'},
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

recipeApp.controller('putController', function($scope, $http, $routeParams) {
  const url = 'http://localhost:8080/recipes/'+$routeParams.id;
  console.log(url);
  var ingredients;
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      var json = JSON.parse(response.data.data);
      $scope.recipe = json[0];
      ingredients = $scope.recipe.ingredients;
      $scope.ingredients = ingredients;
    }, function errorCallback(response) {
      console.log(response);
    });
  
  $scope.remove = function($event, ingredient) {
    console.log(ingredients);
    var index = ingredients.indexOf(ingredient);
    ingredients.splice(index, 1);
    console.log(ingredients);
  };
  
  $scope.add = function() {
    ingredients.push($scope.recipe.newIngredients);
    $scope.recipe.newIngredients = null;
  };
  
  $scope.submit = function() {
    const url = 'http://localhost:8080/recipes/'+$routeParams.id;
    const json = {"name": $scope.recipe.name, "ingredients": $scope.ingredients, "directions": $scope.recipe.directions};
    const stringJSON = JSON.stringify(json);
    $http({
      method: 'PUT',
      url: url,
      headers: {'Authorization': 'Basic '+user, 'Content-Type': 'text'},
      data: json
    }).then(function successCallback(response) {
      console.log(response);
      $scope.message = 'Recipe updated';
      $scope.recipe.name = null;
      $scope.recipe.ingredients = null;
      $scope.recipe.directions = null;
      $scope.ingredients = null;
    }, function errorCallback(response) {
      console.log(response);
      $scope.message = 'You must be logged in to update a recipe';
    });
  };
});

recipeApp.controller('removeController', function($scope, $http, $location, $routeParams) {
  $scope.recipe = JSON.parse($routeParams.id);
  console.log($scope.recipe._id);
  
  $scope.remove = function() {
    const url = 'http://localhost:8080/recipes/'+$scope.recipe._id;
    $http({
      method: 'DELETE',
      url: url,
      headers: {'Authorization': 'Basic '+user}
    }).then(function successCallback(response) {
      console.log(response);
      $location.path('/')
    }, function errorCallback(response) {
      console.log(response);
      $scope.message = 'You must be logged in to delete a recipe';
    });
  };
  
  $scope.keep = function() {
    $location.path('/');
  };
});

recipeApp.controller('loginController', function($scope, $http, $cookies) {
  if ($cookies.get('authorization')) {
    $scope.loginTemplate = {
      path: 'templates/user.html'
    };
    
    user = $cookies.get('authorization');
    const account = atob(user).split(':');
    $scope.username = account[0];
  } else {
    $scope.loginTemplate = {
      path: 'templates/login.html'
    };
  };
  
  $scope.login = function() {
    console.log($scope.login.username);   
    const url = 'http://localhost:8080/user';
    const auth = btoa($scope.login.username+':'+$scope.login.password);
    $http({
      method: 'GET',
      url: url,
      headers: {'Authorization': 'Basic '+auth}
    }).then(function successCallback(response) {
        console.log(response);
        user = auth;
        $cookies.put('authorization', auth);
        console.log($cookies.getAll());
        $scope.loginTemplate.path = 'templates/user.html';
        $scope.username = $scope.login.username;
      }, function errorCallback(response) {
        console.log(response);
        $scope.error = 'Invalid username or password'
      });
  };
  
  $scope.logout = function() {
    $cookies.remove('authorization');
    user = null;
    $scope.loginTemplate.path = 'templates/login.html';
  };
});

recipeApp.controller('accountController', function($scope, $http) {
  var account = atob(user).split(':');
  console.log(account);
  $scope.username = account[0];
});

recipeApp.controller('createAccountController', function($scope, $http) {
  $scope.submit = function() {
    const url = 'http://localhost:8080/user';
    const account = btoa($scope.account.username+':'+$scope.account.password);
    $http({
      method: 'POST',
      url: url,
      headers: {'Authorization': 'Basic '+account}
    }).then(function successCallback(response) {
      console.log(response);
      $scope.message = 'Account: '+$scope.account.username+' created successfully'
      $scope.account.username = null;
      $scope.account.password = null;
    }, function errorCallback(response) {
      console.log(response);
      $scope.message = 'Username already in use';
    });
  };
});

recipeApp.controller('updateAccountController', function($scope, $http) {
  const logged = atob(user).split(':');
  $scope.username = logged[0];
  $scope.submit = function() {
    const url = 'http://localhost:8080/user';
    const account = btoa($scope.username+':'+$scope.account.password);
    $http({
        method: 'PUT',
        url: url,
        headers: {'Authorization': 'Basic '+account}
      }).then(function successCallback(response) {
        console.log(response);
        $scope.message = 'Account: '+$scope.account.username+' password changed'
        $scope.account.username = null;
        $scope.account.password = null;
      }, function errorCallback(response) {
        console.log(response);
        $scope.message = 'Failed to change password';
      });
  };
});

recipeApp.controller('removeAccountController', function($scope, $http, $location, $window, $cookies) {
  if (!user) {
    $location.path('/');
  };
  
  const logged = atob(user).split(':');
  $scope.username = logged[0];
  
  $scope.remove = function() {
    const url = 'http://localhost:8080/user';
    $http({
      method: 'DELETE',
      url: url,
      headers: {'Authorization': 'Basic '+user}
    }).then(function successCallback(response) {
      console.log(response);
      $cookies.remove('authorization');
      user = null;
      $location.path('/');
      $window.location.reload();
    }, function errorCallback(response) {
      console.log(response);
      $scope.message = 'Failed to delete account';
    });
  };
  
  $scope.keep = function() {
    $location.path('/');
  };
});