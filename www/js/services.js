angular.module('starter.services', [])

.factory('Chats', function($q, $cordovaSQLite) {
	// Might use a resource here that returns a JSON array


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