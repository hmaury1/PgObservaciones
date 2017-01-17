// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
/**
 * Isntancia global de sqlite
 * @type {SQLITE}
 */
var db = null;

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])


.run(function($ionicPlatform, $cordovaSQLite) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		/**
		 * Verifico si la extension de cordova esta activa en el dispsitivo, sino
		 * instancio la del web browser o la de Ionic serve
		 */
		if (window.cordova) {
			// Dispositivo
			db = $cordovaSQLite.openDB("my.db");
		} else {
			// Ionic serve
			db = window.openDatabase("my.db", "1.0", "My app", -1);
		}

		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, name text, lasttext text)"); //tabla de ejemplo se elminara despues
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Empresas (IdEmpresa integer primary key, RazonSocial text, IdTipoEmpresa text, IdEstadoEmpresa text)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Dependencias(IdDependencia integer primary key,NombreDependencia text,IdEstadoDependencia text,IdEmpresa integer,FOREIGN KEY(IdEmpresa) REFERENCES Empresas(IdEmpresa))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Lideres(IdLider integer primary key,IdEmpresa integer,IdDependencia integer,IdUsuario integer,Nombre text,IdEstadoLider text,Usuario text,FOREIGN KEY(IdDependencia) REFERENCES Dependencias(IdDependencia),FOREIGN KEY(IdEmpresa) REFERENCES Empresas(IdEmpresa))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Estandares(IdEstandar integer primary key,Descripcion text,IdTipoEstandar text,IdEstadoEstandar text)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Observaciones(IdObservacion integer primary key,IdLider integer,Fecha datetime,Lugar text,IdEstadoObservacion text,IdEmpresa integer,IdObservRemoto text,PrefijoRemoto text,NombreUsuario text,IdEmpresaContratante integer,FOREIGN KEY(IdEmpresa) REFERENCES Empresas(IdEmpresa),FOREIGN KEY(IdEmpresaContratante) REFERENCES Empresas(IdEmpresa),FOREIGN KEY(IdLider) REFERENCES Lideres(IdLider))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS DetObservaciones(IdDetObservacion integer primary key,IdObservacion integer,IdEstandar integer,NumCompPositivos integer,NumCompObservados integer,Acciones text,IdEstadoDetObservacion text,IdDetObservRemoto text,PrefijoRemoto text,FOREIGN KEY(IdEstandar) REFERENCES Estandares(IdEstandar),FOREIGN KEY(IdObservacion) REFERENCES Observaciones(IdObservacion))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Parametros(IdParametro integer primary key,CodParametro text,Atributo text,Descripcion text,EstadoParametro text)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS ValorParametros(IdValorParametro integer primary key,IdParametro integer,CodValorParametro text,CodParametro text,Valor text,Orden text,EstadoValorParametro text,FOREIGN KEY(IdParametro) REFERENCES Parametros(IdParametro))");

	});
})

.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
		.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	})

	// Each tab has its own nav history stack:

	.state('tab.dash', {
		url: '/dash',
		views: {
			'tab-dash': {
				templateUrl: 'templates/tab-dash.html',
				controller: 'DashCtrl'
			}
		}
	})

	.state('tab.chats', {
			url: '/chats',
			views: {
				'tab-chats': {
					templateUrl: 'templates/tab-chats.html',
					controller: 'ChatsCtrl'
				}
			}
		})
		.state('tab.chat-detail', {
			url: '/chats/:chatId',
			views: {
				'tab-chats': {
					templateUrl: 'templates/chat-detail.html',
					controller: 'ChatDetailCtrl'
				}
			}
		})

	.state('tab.account', {
		url: '/account',
		views: {
			'tab-account': {
				templateUrl: 'templates/tab-account.html',
				controller: 'AccountCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/dash');

});