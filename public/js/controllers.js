app.controller('MainController', function($scope) {
  $scope.view = {};

	$scope.view.result = "";

	$scope.view.formData = {};
	$scope.view.boom = "boom"
	$scope.view.sortBy = "-votes";
	$scope.view.sortTitle = " Votes - High to Low";
	$scope.view.searchBy = "$";
	$scope.view.searchTitle = " All";

	$scope.view.newPost = false;
	$scope.view.newComment = {};
	$scope.view.postId = 4;

});
