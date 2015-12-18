/* 	
		when an action happens in index.html this file will handle that action 
		sending the requests to the relevant functions or files 
    'Access-Control-Allow-Origin': 'http://localhost:8080', 
*/
//declare angular modules
const recipeApp = angular.module('recipeApp', ['ngRoute', 'ngCookies']);
//create user account variable
var user;
//recipeApp routing table
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
		.otherwise({ //if desired page not found redirect to homepage
		  redirectTo: 'getAll'
		});
}]);
/*GET CONTROLLERS */
//controller for getAll page
recipeApp.controller('getAllController', function($scope, $http, $cookies) {
  //http get request
  $http({
    method: 'GET',
    url: 'http://localhost:8080/'
  }).then(function successCallback(response) {
      //if request was successful show recipes on page
      $scope.recipes = response.data.data;
    }, function errorCallback(response) {
      //if unsuccessful log error
      console.log(response);
    });
});
//controller for getItem page
recipeApp.controller('getItemController', function($scope, $http, $routeParams) {
  //create url including route parameter id from this pages url
  const url = 'http://localhost:8080/recipes/'+$routeParams.id;
  //http get request
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      //if successful parse data and display on page
      var json = JSON.parse(response.data.data);
      $scope.recipe = json[0];
      $scope.deleter = {_id: json[0]._id, name: json[0].name};
    }, function errorCallback(response) {
      //if unsuccessful log error
      console.log(response);
    });
});
//controller for getRemoteItem page
recipeApp.controller('getRemoteItemController', function($scope, $http, $routeParams) {
  //create url including route parameter id from this pages url
  const url = 'http://localhost:8080/recipes/remote/'+$routeParams.id;
  //http get request
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      //if successful show data on page
      $scope.recipe = response.data.data;
    }, function errorCallback(response) {
      //if unsuccessful log error
      console.log(response);
    });
});
//controller for the search page
recipeApp.controller('searchController', function($scope, $http) {
  //declare function for the search button
  $scope.search = function() {
    //http get request
    $http({
      method: 'GET',
      url: 'http://localhost:8080/recipes/search/'+$scope.search.term
    }).then(function successCallback(response) {
        //if successful show data on page
        $scope.recipes = response.data.data;
      }, function errorCallback(response) {
        //if unsuccessful log error
        console.log(response);
      });
  };
});
/* POST CONTROLLERS */
//controller for the post page
recipeApp.controller('postController', function($scope, $http) {
  //create ingredients variable
  var ingredients = [];
  //declare function for add button
  $scope.add = function() {
    //add new ingredient to ingredients
    ingredients.push($scope.recipe.ingredients);
    //declare ingredients scope (incase it has not already been declared)
    $scope.ingredients = ingredients;
    //empty ingredients input box
    $scope.recipe.ingredients = null;
  };
  //declare function for submit button
  $scope.submit = function() {
    //create a JSON of the data from the page
    const json = {"name": $scope.recipe.name, "ingredients": $scope.ingredients, "directions": $scope.recipe.directions};
    //convert JSON to string
    const stringJSON = JSON.stringify(json);
    //http post request
    $http({
      method: 'POST',
      url: 'http://localhost:8080/recipes',
      headers: {'Authorization': 'Basic '+user, 'Content-Type': 'text'},
      data: json
    }).then(function successCallback(response) {
      //if successful update page to reflect
      $scope.message = 'Recipe saved';
      $scope.recipe.name = null;
      $scope.recipe.ingredients = null;
      $scope.recipe.directions = null;
      ingredients = [];
      $scope.ingredients = null;
    }, function errorCallback(response) {
      //if unsuccessful log error and update page to reflect
      console.log(response);
      $scope.message = 'You must be logged in to save a recipe';
    });
  };
});
/* PUT CONTROLLERS */
//controller for put page
recipeApp.controller('putController', function($scope, $http, $routeParams) {
  //create URL with route paramters ID
  const url = 'http://localhost:8080/recipes/'+$routeParams.id;
  //create ingredients variable
  var ingredients;
  //http get request to get the recipe to be updated
  $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      //if successful parse data
      var json = JSON.parse(response.data.data);
      $scope.recipe = json[0];
      //add ingredients to ingredients variable
      ingredients = $scope.recipe.ingredients;
      $scope.ingredients = ingredients;
    }, function errorCallback(response) {
      //if unsuccessful log error
      console.log(response);
    });
  //function for removing ingredients by clicking on them
  $scope.remove = function($event, ingredient) {
    //find index of selected ingredient
    var index = ingredients.indexOf(ingredient);
    //remove selected ingredient from ingredients
    ingredients.splice(index, 1);
  };
  //function for adding more ingredients
  $scope.add = function() {
    //add new ingredient to list
    ingredients.push($scope.recipe.newIngredients);
    //clear ingredients box
    $scope.recipe.newIngredients = null;
  };
  //submit updated recipe function
  $scope.submit = function() {
    //create a JSON of the data
    const json = {"name": $scope.recipe.name, "ingredients": $scope.ingredients, "directions": $scope.recipe.directions};
    //convert it to string
    const stringJSON = JSON.stringify(json);
    //http put request
    $http({
      method: 'PUT',
      url: url,
      headers: {'Authorization': 'Basic '+user, 'Content-Type': 'text'},
      data: json
    }).then(function successCallback(response) {
      //if successful update page to show
      $scope.message = 'Recipe updated';
      $scope.recipe.name = null;
      $scope.recipe.ingredients = null;
      $scope.recipe.directions = null;
      $scope.ingredients = null;
    }, function errorCallback(response) {
      //if unsuccessful log error and update page to show
      console.log(response);
      $scope.message = 'You must be logged in to update a recipe';
    });
  };
});
/* REMOVE CONTROLLERS */
//controller for the remove page
recipeApp.controller('removeController', function($scope, $http, $location, $routeParams) {
  //parse route parameters for recipe
  $scope.recipe = JSON.parse($routeParams.id);
  //declare function for remove button
  $scope.remove = function() {
    //create url
    const url = 'http://localhost:8080/recipes/'+$scope.recipe._id;
    //http delete request
    $http({
      method: 'DELETE',
      url: url,
      headers: {'Authorization': 'Basic '+user}
    }).then(function successCallback(response) {
      //if successful log response and navigate to home page
      console.log(response);
      $location.path('/')
    }, function errorCallback(response) {
      //if unsuccessful log response and update page
      console.log(response);
      $scope.message = 'You must be logged in to delete a recipe';
    });
  };
  //function for keep button
  $scope.keep = function() {
    //navigate to home page
    $location.path('/');
  };
});
/* USER ACCOUNT CONTROLLERS */
//login controller
recipeApp.controller('loginController', function($scope, $http, $window, $cookies) {
  //on page load check for login info stored in cookies
  if ($cookies.get('authorization')) {
    //if found set template of user section to logged in
    $scope.loginTemplate = {
      path: 'templates/user.html'
    };
    //make user variable equal cookie
    user = $cookies.get('authorization');
    const account = atob(user).split(':');
    //set username shown on page
    $scope.username = account[0];
  } else {
    //if not logged in set template of user section to not logged in
    $scope.loginTemplate = {
      path: 'templates/login.html'
    };
  };
  //login button function
  $scope.login = function() {
    //create auth variable
    const auth = btoa($scope.login.username+':'+$scope.login.password);
    //http get request
    $http({
      method: 'GET',
      url: 'http://localhost:8080/user',
      headers: {'Authorization': 'Basic '+auth}
    }).then(function successCallback(response) {
        //if successful set user to equal auth
        user = auth;
        //create a cookie for the authorization
        $cookies.put('authorization', auth);
        //set template of user section to logged in
        $scope.loginTemplate.path = 'templates/user.html';
        //show username on page
        $scope.username = $scope.login.username;
      }, function errorCallback(response) {
        //if unsuccessful log error and update page
        console.log(response);
        $scope.error = 'Invalid username or password'
      });
  };
  //function for log out button
  $scope.logout = function() {
    //delete authorization cookie
    $cookies.remove('authorization');
    //clear user variable
    user = null;
    //set user template to not logged in
    $scope.loginTemplate.path = 'templates/login.html';
    //reload page to change user template
    $window.location.reload();
  };
});
//controller for account page
recipeApp.controller('accountController', function($scope, $http) {
  //get the username of the current user
  var account = atob(user).split(':');
  $scope.username = account[0];
});
//controller for create account page
recipeApp.controller('createAccountController', function($scope, $http) {
  //function for submit button
  $scope.submit = function() {
    //get desired account info from page
    const account = btoa($scope.account.username+':'+$scope.account.password);
    //http post request
    $http({
      method: 'POST',
      url: 'http://localhost:8080/user',
      headers: {'Authorization': 'Basic '+account}
    }).then(function successCallback(response) {
      //if successful update page
      $scope.message = 'Account: '+$scope.account.username+' created successfully'
      $scope.account.username = null;
      $scope.account.password = null;
    }, function errorCallback(response) {
      //if unsuccessful log response and update page
      console.log(response);
      $scope.message = 'Username already in use';
    });
  };
});
//controller for update account page
recipeApp.controller('updateAccountController', function($scope, $cookies, $http) {
  //decode user account
  const logged = atob(user).split(':');
  //show username on page
  $scope.username = logged[0];
  //submit function to update account
  $scope.submit = function() {
    //encode new account info
    const account = btoa($scope.username+':'+$scope.account.password);
    //http put request
    $http({
        method: 'PUT',
        url: 'http://localhost:8080/user',
        headers: {'Authorization': 'Basic '+account}
      }).then(function successCallback(response) {
        //if successful update page
        $scope.message = 'Account: '+$scope.username+' password changed'
        $scope.account.username = null;
        $scope.account.password = null;
        //change logged in credentials
        var newCredentials = atob(user).split(':');
        user = btoa(account[0]+':'+$scope.account.password);
        $cookies.remove('authorization');
        $cookies.put('authorization', user);
      }, function errorCallback(response) {
        //if unsuccessful log response and update page
        console.log(response);
        $scope.message = 'Failed to change password';
      });
  };
});
//controller for remove account page
recipeApp.controller('removeAccountController', function($scope, $http, $location, $window, $cookies) {
  //decode user account info
  const logged = atob(user).split(':');
  //display username on page
  $scope.username = logged[0];
  //function for remove button
  $scope.remove = function() {
    //http delete request
    $http({
      method: 'DELETE',
      url: 'http://localhost:8080/user',
      headers: {'Authorization': 'Basic '+user}
    }).then(function successCallback(response) {
      //if successful remove authorization cookie
      $cookies.remove('authorization');
      //clear user
      user = null;
      //return to homepage
      $location.path('/');
      //refresh page to reset template
      $window.location.reload();
    }, function errorCallback(response) {
      //if unsuccessful log response and update page
      console.log(response);
      $scope.message = 'Failed to delete account';
    });
  };
  //function for keep button
  $scope.keep = function() {
    //return to homepage
    $location.path('/');
  };
});