angular.module('starter.services', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {


	function query(query, parameters) {
		parameters = parameters || [];
		var q = $q.defer();

		$cordovaSQLite.execute(db, query, parameters)
			.then(function(result) {
				q.resolve(result);
			}, function(error) {
				console.warn('I found an error');
				console.warn(error);
				q.reject(error);
			});

		return q.promise;
	}

	// Proces a result set
	function getAll(result) {
		var output = [];

		for (var i = 0; i < result.rows.length; i++) {
			output.push(result.rows.item(i));
		}
		return output;
	}

	// Proces a single result
	function getById(result) {
		var output = null;
		output = angular.copy(result.rows.item(0));
		return output;
	}

	return {
		query: query,
		getAll: getAll,
		getById: getById
	};

})

.factory('Chats', function($q, $cordovaSQLite) {

	return {
		all: function() {
			var q = $q.defer();
			var chats = [];
			var query = "SELECT name, lasttext FROM people";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				if (res.rows.length > 0) {
					q.resolve(res.rows);
				} else {
					console.log("No results found");
				}
			}, function(err) {
				console.error(err);
			});
			return q.promise;
		},
		remove: function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		},
		get: function(chatId) {
			var chats = [];
			var query = "SELECT name, lasttext FROM people";
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
				if (res.rows.length > 0) {
					return res.rows;
				} else {
					console.log("No results found");
				}
			}, function(err) {
				console.error(err);
			});

		},
		save: function(name, lasttext) {
			var query = "INSERT INTO people (name, lasttext) VALUES (?,?)";
			$cordovaSQLite.execute(db, query, [name, lasttext]).then(function(res) {
				console.log("INSERT ID -> " + res.insertId);
			}, function(err) {
				console.error(err);
			});
		}
	};
});