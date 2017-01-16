angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});
	//
	$scope.data = {
		name: '',
		lastText: ''
	};


	$scope.guardar = function() {

		Chats.save($scope.data.name, $scope.data.lastText);
		$scope.data = {
			name: '',
			lastText: ''
		};
		init();
	};



	function init() {
		$scope.chats = [];
		var lista = [];
		var chats = Chats.all().then(function(datar) {
			var data = datar;
			for (var i = 0; i < data.length; i++) {

				lista.push({
					name: data[i].name,
					lastText: data[i].lasttext
				});

			}
		});

		$scope.chats = lista;
	}



	//$scope.chats = Chats.all();
	//

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};

	init();

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});