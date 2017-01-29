angular.module('app.routes', [])

.config(function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

	$ionicConfigProvider.navBar.alignTitle('center');

	var datePickerObj = {
		inputDate: new Date(),
		setLabel: 'Elegir',
		todayLabel: 'Hoy',
		closeLabel: 'Cerrar',
		mondayFirst: false,
		weeksList: ["D", "L", "M", "M", "J", "V", "S"],
		monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		templateType: 'popup',
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
	});

	$urlRouterProvider.otherwise('/side-content/crearobservacion');

});