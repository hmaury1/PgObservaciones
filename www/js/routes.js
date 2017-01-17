angular.module('app.routes', [])

.config(function($stateProvider, $httpProvider, $urlRouterProvider) {

	$httpProvider.interceptors.push(function($rootScope, $q) {
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
	});

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

	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})

	$urlRouterProvider.otherwise('/side-content/crearobservacion')

});