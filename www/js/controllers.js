angular.module('app.controllers', [])

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

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};

	init();

})

.controller('LoginCtrl', function($scope) {

})

.controller('MenuCtrl', function($scope) {

})

.controller('CrearObservacionCtrl', function($scope, $filter, $state, ionicDatePicker, Empresas, Observaciones) {

	$scope.data = {
		empresaselected: null,
		empresascontraselected: null,
		empresa: {
			IdEmpresa: -1
		},
		empresascontra: {
			IdEmpresa: -1
		},
		fecha: '',
		lugar: ''
	};

	$scope.empresas = [];
	$scope.empresascontra = [];

	$scope.openDatePicker = function() {
		var ipObj1 = {
			callback: function(val) { //Mandatory
				var pick = new Date(val);
				$scope.data.fecha = $filter('date')(pick, 'yyyy-MM-dd');
			}
		};
		ionicDatePicker.openDatePicker(ipObj1);
	};

	function init() {
		Empresas.getAll().then(function(data) {
			$scope.empresas = data;
			$scope.data.empresa.IdEmpresa = $scope.empresas[0].IdEmpresa;
		});

		Empresas.getAll().then(function(data) {
			$scope.empresascontra = data;
			$scope.data.empresascontra.IdEmpresa = $scope.empresascontra[0].IdEmpresa;
		});
	}


	$scope.continuar = function() {
		var parames = {
			IdLider: 0,
			Fecha: $scope.data.fecha,
			Lugar: $scope.data.lugar,
			IdEstadoObservacion: 'OBSEACTIVO',
			IdEmpresa: $scope.data.empresa.IdEmpresa,
			IdObservRemoto: '',
			PrefijoRemoto: '',
			NombreUsuario: '',
			IdEmpresaContratante: $scope.data.empresascontra.IdEmpresa
		};
		Observaciones.add(parames).then(function(result) {
			$scope.data = {
				empresaselected: null,
				empresascontraselected: null,
				empresa: {
					IdEmpresa: -1
				},
				empresascontra: {
					IdEmpresa: -1
				},
				fecha: '',
				lugar: ''
			};
			$state.go('menu.det-observacion', {
				id_observacion: result.insertId
			});
		})
	};

	init();
})

.controller('DetalleObservacionCtrl', function($scope, $stateParams, Empresas) {
	var id_observacion = $stateParams.id_observacion;

	function init() {

	}

	init();
})

.controller('ObsPendientesCtrl', function($scope) {

})

.controller('ObsPorEnviarCtrl', function($scope) {

})

.controller('ParametrosCtrl', function($scope) {

});