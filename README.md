NoScope
=========

NoScope solves the problem of syncing local variables, to a watched object. Originally it was made for [AngularJS](https://github.com/angular/angular.js), but I realize this could be used anywhere that someone needed local variables to match a different object's variables. The code uses [Object.defineProperty](http://kangax.github.io/compat-table/es5/#Object.defineProperty) and requires you to use [eval](http://www.nczonline.net/blog/2013/06/25/eval-isnt-evil-just-misunderstood/). Currently, minification is not supported, but will be in the near future.

To use, just place the following at the bottom of your function:

    eval(NoScope('scopeObjectName', ['arrayOfVarsToSyncToScope']));

The Problem
---------

In angular's controllers, there is often the problem of having to place ```$scope.``` everywhere. Let's look at the following example:

    .controller('JumbotronCtrl', ['$scope', '$http', 'filterFilter', function($scope,   $http,   filterFilter) {
    
    	// ...
    
    	var defaultCategory = 'basics';
    	$scope.category = defaultCategory;
    
    	$scope.loading = true;
    	$http.get('./featured-videos.json').success(function(results) {
    		$scope.loading = false;
    		$scope.allVideos = results;
    		$scope.filterByCategory($scope.category);
    	});
    
    	$scope.filterBySearch = function(search) {
    		$scope.search = search;
    		$scope.category = null;
    		$scope.videos = filterFilter($scope.allVideos, $scope.search);
    	};
    
    	$scope.filterByCategory = function(category) {
    		$scope.search = null;
    		$scope.category = category;
    		$scope.videos = byCategoryFilter($scope.allVideos, $scope.category);
    	};
    }])

The prefix to every variable and function is ```$scope.```. This could be renamed to something shorter, or by using the [controllerAs](https://docs.angularjs.org/api/ng/directive/ngController) syntax, replaced with ```this.```. Either way, it makes the code look somewhat ugly.

The Solution
---------

Lets take the same controller, and use NoScope:

    .controller('JumbotronCtrl', ['$scope', '$http', 'filterFilter', function($scope,   $http,   filterFilter) {
    
    	// ...
    
    	var category = defaultCategory = 'basics',
    	    loading = true, search, videos, allVideos;
    
    	$http.get('./featured-videos.json').success(function(results) {
    		loading = false;
    		allVideos = results;
    		filterByCategory(category);
    	});
    
    	function filterBySearch(s) {
    		search = s;
    		category = null;
    		videos = filterFilter(allVideos, search);
    	}
    
    	function filterByCategory(c) {
    		search = null;
    		category = c;
    		videos = byCategoryFilter(allVideos, category);
    	}

    	eval(noScope('$scope', [
    		'category', 'loading', 'search', 'videos', 'allVideos',
    		'filterBySearch', 'filterByCategory'
    	]));
    }])

The code is almost the same, but almost all references to $scope are removed.  Other benfits are present, like the ability to add or remove any variables from the $scope at any time. Additionally, you now have an easy to see list of all variables avaiable from your controller. A size benifit is also there, because even the best minifier can only reduce it to a two character prefix.

Eval
---------

You may think "but you are making me use eval! That's evil!"

Not so fast. [eval() isn't evil, just misunderstood](http://www.nczonline.net/blog/2013/06/25/eval-isnt-evil-just-misunderstood/). Most of the time, eval can be substitued for a faster better method, but other times it cannot be. For example, AngularJS uses eval in the getterFn of their lexer (look for ```new Function```).  NoScope's eval is only run once per controller initlization, so it's not a performance issue, and you are not evaling user input, so it's not a security issue.  The reason NoScope needs you to eval, is that it needs the current function's context, and eval is the only way to do that.
