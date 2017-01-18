angular.module('app.routes', [])

.config(function($stateProvider, $httpProvider, $urlRouterProvider, ionicDatePickerProvider) {

	/*$httpProvider.interceptors.push(function($rootScope, $q) {
		return {
			request: function(config) {
				$rootScope.$broadcast('loading:show');
				return config
			},
			response: function(response) {
				$rootScope.$broadcast('loading:hide');
				return response
			},
			responseError: function(rejection) {
				$rootScope.$broadcast('loading:hide');
				return $q.reject(rejection);
			}
		}
	});*/

	//$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	//$httpProvider.defaults.useXDomain = true;
	//delete $httpProvider.defaults.headers.common['X-Requested-With'];
	var datePickerObj = {
		inputDate: new Date(),
		setLabel: 'Elegir',
		todayLabel: 'Hoy',
		closeLabel: 'Cerrar',
		mondayFirst: false,
		weeksList: ["D", "L", "M", "M", "J", "V", "S"],
		monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		templateType: 'popup',
		//from: new Date(2017, 1, 1),
		//to: new Date(2020, 8, 1),
		showTodayButton: true,
		dateFormat: 'yyyy-MM-dd',
		closeOnSelect: true,
		disableWeekdays: [6],
	};
	ionicDatePickerProvider.configDatePicker(datePickerObj);

	$stateProvider

		.state('menu', {
		url: '/side-content',
		templateUrl: 'templates/menu.html',
		controller: 'MenuCtrl'
	})

	.state('menu.crearobservacion', {
		url: '/crearobservacion',
		views: {
			'side-content': {
				templateUrl: 'templates/crear-observacion.html',
				controller: 'CrearObservacionCtrl'
			}
		}
	})

	.state('menu.det-observacion', {
		url: '/det-observacion/{id_observacion}',
		views: {
			'side-content': {
				templateUrl: 'templates/det-observacion.html',
				controller: 'DetalleObservacionCtrl'
			}
		}
	})

	.state('menu.obspendientes', {
		url: '/obspendientes',
		views: {
			'side-content': {
				templateUrl: 'templates/obs-pendientes.html',
				controller: 'ObsPendientesCtrl'
			}
		}
	})

	.state('menu.obsporenviar', {
		url: '/obsporenviar',
		views: {
			'side-content': {
				templateUrl: 'templates/obs-porenviar.html',
				controller: 'ObsPorEnviarCtrl'
			}
		}
	})

	.state('menu.parametros', {
		url: '/parametros',
		views: {
			'side-content': {
				templateUrl: 'templates/parametros.html',
				controller: 'ParametrosCtrl'
			}
		}
	})

	.state('menu.configuracion', {
		url: '/configuracion',
		views: {
			'side-content': {
				templateUrl: 'templates/configuracion.html',
				controller: 'ConfiguracionCtrl'
			}
		}
	})

	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})

	$urlRouterProvider.otherwise('/side-content/crearobservacion')

});