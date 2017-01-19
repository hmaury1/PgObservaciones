angular.module('app.services', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {


	function query(query, parameters) {
		parameters = parameters || [];
		var q = $q.defer();

		$cordovaSQLite.execute(db, query, parameters)
			.then(function(result) {
				q.resolve(result);
			}, function(error) {
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
})

.factory('Empresas', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdEmpresa,RazonSocial FROM Empresas")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function get(key) {
		var parameters = [key];
		return DBA.query("SELECT IdEmpresa,RazonSocial FROM Empresas WHERE IdEmpresa = (?)", parameters)
			.then(function(result) {
				return DBA.getById(result);
			});
	}

	function add(obj) {
		var parameters = [obj.IdEmpresa, obj.IdEstadoEmpresa, obj.IdTipoEmpresa, obj.RazonSocial];
		return DBA.query("INSERT INTO Empresas (IdEmpresa,IdEstadoEmpresa,IdTipoEmpresa,RazonSocial) VALUES (?,?,?,?)", parameters);
	}

	function truncate() {
		return DBA.query("DELETE FROM Empresas")
	}

	return {
		getAll: getAll,
		get: get,
		add: add,
		truncate: truncate
	};

})

.factory('Observaciones', function($q, DBA) {

	function add(obj) {
		var parameters = [obj.IdLider, obj.Fecha, obj.Lugar, obj.IdEstadoObservacion, obj.IdEmpresa, obj.IdObservRemoto, obj.PrefijoRemoto, obj.NombreUsuario, obj.IdEmpresaContratante];
		return DBA.query("INSERT INTO Observaciones (IdLider, Fecha, Lugar, IdEstadoObservacion, IdEmpresa, IdObservRemoto, PrefijoRemoto, NombreUsuario, IdEmpresaContratante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", parameters);
	}

	return {
		add: add
	}
})

.factory('Lideres', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdLider,IdEmpresa,IdDependencia,IdUsuario,Nombre,IdEstadoLider,Usuario FROM Lideres")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function get(key) {
		var parameters = [key];
		return DBA.query("SELECT IdLider,IdEmpresa,IdDependencia,IdUsuario,Nombre,IdEstadoLider,Usuario FROM Lideres WHERE IdLider = (?)", parameters)
			.then(function(result) {
				return DBA.getById(result);
			});
	}

	function add(obj) {
		var parameters = [obj.IdLider, obj.IdEmpresa, obj.IdDependencia, obj.IdUsuario, obj.Nombre, obj.IdEstadoLider, obj.Usuario];
		return DBA.query("INSERT INTO Lideres (IdLider,IdEmpresa,IdDependencia,IdUsuario,Nombre,IdEstadoLider,Usuario) VALUES (?,?,?,?,?,?,?)", parameters);
	}

	function truncate() {
		return DBA.query("DELETE FROM Lideres");
	}

	return {
		getAll: getAll,
		get: get,
		add: add,
		truncate: truncate
	};

})


.factory('DetObservaciones', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdDetObservacion,IdObservacion,IdEstandar,NumCompPositivos,NumCompObservados,Acciones,IdEstadoDetObservacion,IdDetObservRemoto,PrefijoRemoto FROM DetObservaciones")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function add(obj) {
		var parameters = [
			obj.IdObservacion,
			obj.IdEstandar,
			obj.NumCompPositivos,
			obj.NumCompObservados,
			obj.Acciones,
			obj.IdEstadoDetObservacion,
			obj.IdDetObservRemoto,
			obj.PrefijoRemoto
		];
		return DBA.query("INSERT INTO DetObservaciones (IdObservacion,IdEstandar,NumCompPositivos,NumCompObservados,Acciones,IdEstadoDetObservacion,IdDetObservRemoto,PrefijoRemoto) VALUES (?,?,?,?,?,?,?,?)", parameters);
	}

	function getByIdObservacion(key) {
		var parameters = [key];
		return DBA.query("SELECT IdDetObservacion,IdObservacion,IdEstandar,NumCompPositivos,NumCompObservados,Acciones,IdEstadoDetObservacion,IdDetObservRemoto,PrefijoRemoto FROM DetObservaciones WHERE IdObservacion = (?)", parameters)
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function updateDetalle(NCP, NCO, Acciones, AIdDetObservacion) {
		var parameters = [NCP, NCO, Acciones, AIdDetObservacion];
		return DBA.query("UPDATE DetObservaciones SET NumCompPositivos = (?), NumCompObservados = (?), Acciones = (?) WHERE IdDetObservacion = (?)", parameters);
	}

	return {
		getAll: getAll,
		add: add,
		getByIdObservacion: getByIdObservacion,
		updateDetalle: updateDetalle
	}
})

.factory('Estandares', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdEstandar,Descripcion,IdTipoEstandar,IdEstadoEstandar FROM Estandares")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function get(key) {
		var parameters = [key];
		return DBA.query("SELECT IdEstandar,Descripcion,IdTipoEstandar,IdEstadoEstandar FROM Estandares WHERE IdEstandar = (?)", parameters)
			.then(function(result) {
				return DBA.getById(result);
			});
	}

	return {
		getAll: getAll,
		get: get
	}
})

.factory('Parametros', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdParametro,CodParametro,Atributo,Descripcion,EstadoParametro FROM Parametros")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function add(obj) {
		var parameters = [obj.IdParametro, obj.CodParametro, obj.Atributo, obj.Descripcion, obj.EstadoParametro];
		return DBA.query("INSERT INTO Parametros (IdParametro,CodParametro,Atributo,Descripcion,EstadoParametro) VALUES (?,?,?,?,?)", parameters);
	}

	function truncate() {
		return DBA.query("DELETE FROM Parametros");
	}

	return {
		getAll: getAll,
		add: add,
		truncate: truncate
	}
})

.factory('ValorParametros', function($q, DBA) {

	function getAll() {
		return DBA.query("SELECT IdValorParametro,IdParametro,CodValorParametro,CodParametro,Valor,Orden,EstadoValorParametro FROM ValorParametros")
			.then(function(result) {
				return DBA.getAll(result);
			});
	}

	function add(obj) {
		var parameters = [obj.IdValorParametro, obj.IdParametro, obj.CodValorParametro, obj.CodParametro, obj.Valor, obj.Orden, obj.EstadoValorParametro];
		return DBA.query("INSERT INTO ValorParametros (IdValorParametro,IdParametro,CodValorParametro,CodParametro,Valor,Orden,EstadoValorParametro) VALUES (?,?,?,?,?,?,?)", parameters);
	}

	function truncate() {
		return DBA.query("DELETE FROM ValorParametros");
	}

	return {
		getAll: getAll,
		add: add,
		truncate: truncate
	}
})

/**
 * Servicios Api
 *
 */
.factory('EmpresasService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Empresas/:id', {
		id: "@id"
	});
})

.factory('LideresService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Lideres/:id', {
		id: "@id"
	});
})

.factory('DependenciasService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Dependencias/:id', {
		id: "@id"
	});
})

.factory('ObservacionesService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Dependencias/:id', {
		id: "@id"
	});
})

.factory('DetObservacionesService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Dependencias/:id', {
		id: "@id"
	});
})

.factory('ValorParametrosService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/ValorParametros/:id', {
		id: "@id"
	});
})

.factory('ParametrosService', function($resource, BASE_URL) {
	return $resource(BASE_URL + '/api/Parametros/:id', {
		id: "@id"
	});
});