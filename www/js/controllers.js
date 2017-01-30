/*jshint loopfunc: true */

angular.module('app.controllers', [])

.controller('LoginCtrl', function($rootScope, $scope, $state, ionicAuth, Lideres, $ionicPopup, LideresService, $cordovaDevice) {
	var uuid = '';
	$scope.data = {
		'alias': '',
		'password': '',
		'recordar': true
	};

	document.addEventListener("deviceready", function() {
		uuid = $cordovaDevice.getUUID();
	}, false);

	$scope.error = '';
	if (ionicAuth.isAuthenticated()) {
		$state.go('menu.crearobservacion');
	}

	$scope.login = function() {
		$scope.error = '';
		$rootScope.$broadcast('loading:show');
		ionicAuth.login($scope.data.alias, $scope.data.password, $scope.data.recordar, uuid).then(function(data) {
			if (data.success) {
				Lideres.getUser(data.id).then(function(result) {
					if (!result) {
						var promise = LideresService.query().$promise;
						promise.then(function(result33) {
							Lideres.truncate();
							for (var i = 0; i < result33.length; i++) {
								Lideres.add({
									IdLider: result33[i].IdLider,
									IdEmpresa: result33[i].IdEmpresa,
									IdDependencia: result33[i].IdDependencia,
									IdUsuario: result33[i].IdUsuario,
									Nombre: result33[i].Nombre,
									IdEstadoLider: result33[i].IdEstadoLider,
									Usuario: result33[i].Usuario,
								});
							}
							Lideres.getUser(data.id).then(function(result2) {
								if (result2 === null) {
									$rootScope.$broadcast('loading:hide');
									$ionicPopup.alert({
										title: "Información",
										content: 'Usted no se encuentra en la lista de Lideres'
									});
									ionicAuth.logout();
								} else {
									$rootScope.$broadcast('loading:hide');
									$state.go('menu.crearobservacion');
								}
							});
						});

					} else {
						$rootScope.$broadcast('loading:hide');
						$state.go('menu.crearobservacion');
					}
				});
			} else {
				$rootScope.$broadcast('loading:hide');
				$ionicPopup.alert({
					title: "Información",
					content: 'Usuario y/o Clave incorrectos, o el uuid no esta registrado por favor contactar con el administrador'
				});
			}
		}, function(error) {
			$rootScope.$broadcast('loading:hide');
			$scope.error = error.message;
		});
	};
})

.controller('MenuCtrl', function($scope, ionicAuth, $ionicSideMenuDelegate, $state, $cordovaDevice, $ionicPopup, $cordovaClipboard) {
	$scope.isLogged = false;
	var uuid = '';
	$scope.$on("$ionicView.enter", function() {
		$scope.username = ionicAuth.getUserName();
		$scope.isLogged = ionicAuth.isAuthenticated();

		$scope.$digest();
	});

	document.addEventListener("deviceready", function() {
		uuid = $cordovaDevice.getUUID();
	}, false);

	$scope.obtenerUuid = function() {
		$ionicPopup.alert({
			title: "Información",
			okText: 'Copiar',
			content: uuid
		}).then(function() {
			$cordovaClipboard.copy(uuid);
		});
	};

	$scope.cerrarSession = function() {
		ionicAuth.logout();
		$scope.username = '';
		$scope.isLogged = false;
		$ionicSideMenuDelegate.toggleLeft();
		$state.go('menu.crearobservacion');
	};
})

.controller('CrearObservacionCtrl', function($scope, $filter, $state, ionicDatePicker, Empresas,
	Observaciones, Estandares, DetObservaciones, $cordovaDevice, $timeout, $ionicNavBarDelegate) {

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
			if (data.length > 0) {
				$scope.data.empresa.IdEmpresa = $scope.empresas[0].IdEmpresa;
			}
		});

		Empresas.getAll().then(function(data) {
			$scope.empresascontra = data;
			if (data.length > 0) {
				$scope.data.empresascontra.IdEmpresa = $scope.empresascontra[0].IdEmpresa;
			}
		});
	}

	$scope.limpiarForm = function() {
		$scope.data = {
			empresaselected: null,
			empresascontraselected: null,
			empresa: {
				IdEmpresa: $scope.empresas[0].IdEmpresa
			},
			empresascontra: {
				IdEmpresa: $scope.empresas[0].IdEmpresa
			},
			fecha: '',
			lugar: ''
		};
	};

	var perfijo = '';

	document.addEventListener("deviceready", function() {
		perfijo = $cordovaDevice.getUUID();
	}, false);

	$scope.continuar = function() {
		var parames = {
			IdLider: 0,
			Fecha: $scope.data.fecha,
			Lugar: $scope.data.lugar,
			IdEstadoObservacion: 'OBSEPEN',
			IdEmpresa: $scope.data.empresa.IdEmpresa,
			IdObservRemoto: 'DOBSACTIVO',
			PrefijoRemoto: perfijo,
			//PrefijoRemoto: '',
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

			Estandares.getAll().then(function(data) {
				for (var i = 0; i < data.length; i++) {
					DetObservaciones.add({
						IdObservacion: result.insertId,
						IdEstandar: data[i].IdEstandar,
						Acciones: '',
						IdEstadoDetObservacion: 'DOBSPEN',
						IdDetObservRemoto: 'DOBSACTIVO',
						PrefijoRemoto: 0
					});
				}
				$state.go('menu.det-observacion', {
					id_observacion: result.insertId
				});
			});

		});
	};

	$scope.$on("$ionicView.enter", function() {
		init();
	});

	$scope.$on('$ionicView.afterEnter', function(event, viewData) {
		$timeout(function() {
			$ionicNavBarDelegate.align('center');
		}, 100);
	});

})

.controller('DetalleObservacionCtrl', function($scope, $stateParams, $state, $ionicHistory, $ionicPopup, DetObservaciones,
	Estandares, Observaciones, $timeout, $ionicNavBarDelegate) {
	/**
	 * id de la observacion
	 * @type {Number}
	 */
	var id_observacion = $stateParams.id_observacion;
	/**
	 * Variable con que se lleva en conteo de cual formulario se muestra
	 * @type {Number}
	 */
	var indice = 0;
	/**
	 * Mantengo el memoria la lista de detalle de observacion con sus campos a cambiar
	 * @type {Array}
	 */
	var forms = [];
	/**
	 * Habilito el boton continuar
	 * @type {Boolean}
	 */
	$scope.disabledContinuar = false;
	/**
	 * Habilito el boton atras
	 * @type {Boolean}
	 */
	$scope.disabledAtras = true;
	$scope.descripcion = '';
	$scope.data = {
		acciones: '',
		ncp: 0,
		nco: 0,
		IdDetObservacion: 1,
		IdEstandar: 1
	};
	$scope.indiceEstandar = 1;
	$scope.textoBoton = 'Continuar';

	$scope.continuar = function() {

		if (!validar()) {
			$ionicPopup.alert({
				title: "Información",
				content: 'Los comportamientos positivos tienes que ser menor o igual a los observados'
			});
			return;
		}

		if (validar_para_acciones()) {
			if (!validar_text_10()) {
				$ionicPopup.alert({
					title: "Información",
					content: 'Las acciones deben tener mas de 10 caracteres'
				});
				return;
			}
		}

		if ($scope.textoBoton == 'Guardar') {

			updateDet(function() {
				$state.go('menu.crearobservacion');
				location.reload();
			});

		} else {
			$scope.indiceEstandar++;
			updateDet(function() {
				if (indice == forms.length - 1) {
					$scope.disabledContinuar = true;
				} else {
					$scope.disabledContinuar = false;
					indice++;
					if (indice == forms.length - 1) {
						$scope.textoBoton = 'Guardar';
						$scope.disabledContinuar = false;
					}
					$scope.disabledAtras = false;
					loadForm();
				}
			});
		}
	};

	$scope.atras = function() {
		if (!validar()) {
			$ionicPopup.alert({
				title: "Información",
				content: 'Los comportamientos positivos tienes que ser menor o igual a los observados'
			});
			return;
		}
		if (validar_para_acciones()) {
			if (!validar_text_10()) {
				$ionicPopup.alert({
					title: "Información",
					content: 'Las acciones deben tener mas de 10 caracteres'
				});
				return;
			}
		}
		$scope.textoBoton = 'Continuar';
		$scope.indiceEstandar--;
		updateDet(function() {
			if (indice === 0) {
				$scope.disabledAtras = true;
				$scope.disabledContinuar = false;
			} else {
				indice--;
				$scope.disabledContinuar = false;
				if (indice === 0) {
					$scope.disabledAtras = true;
					$scope.disabledContinuar = false;
				}
				loadForm();
			}
		});

	};

	//Los comportamiento positivos tienes que ser menor o igual a los observados nunca mayor
	function validar() {
		return ($scope.data.ncp > $scope.data.nco ? false : true);
	}

	function validar_para_acciones() {

		if (!angular.isDefined($scope.data.ncp) && !angular.isDefined($scope.data.nco)) {
			return false;
		}

		//las acciones solo son obligatorias si las positivas son diferentes a las observadas.
		if ($scope.data.ncp === 0 && $scope.data.nco > 0) {
			return false;
		} else {
			return ($scope.data.ncp != $scope.data.nco ? true : false);
		}
	}

	function validar_text_10() {
		return ($scope.data.acciones.length < 10 ? false : true);
	}

	/**
	 * Actualizo el detalle de la observacion ya sea atras o adelante
	 * @param  {[type]} func [description]
	 * @return {[type]}      [description]
	 */
	function updateDet(func) {
		/**
		 * Valido por cada continuar persisto en la base de datos
		 */
		DetObservaciones.updateDetalle($scope.data.ncp, $scope.data.nco, $scope.data.acciones, $scope.data.IdDetObservacion).then(function() {
			/**
			 * se actulizan los datos en memoria en cada formulario con su indice
			 */
			forms[indice].acciones = $scope.data.acciones;
			forms[indice].ncp = $scope.data.ncp;
			forms[indice].IdDetObservacion = $scope.data.IdDetObservacion;
			forms[indice].nco = $scope.data.nco;
			forms[indice].IdEstandar = $scope.data.IdEstandar;

			func();
			loadEstandar();
		});
	}

	function loadForm() {
		$scope.data = {
			acciones: forms[indice].acciones,
			ncp: forms[indice].ncp,
			nco: forms[indice].nco,
			IdDetObservacion: forms[indice].IdDetObservacion,
			IdEstandar: forms[indice].IdEstandar
		};
	}

	function loadEstandar() {
		Estandares.get($scope.data.IdEstandar).then(function(data) {
			$scope.descripcion = data.Descripcion;
		});
	}

	function init() {
		indice = 0;
		$scope.data.indiceEstandar = 1;
		DetObservaciones.getByIdObservacion(id_observacion).then(function(data) {
			for (var i = 0; i < data.length; i++) {
				forms.push({
					acciones: data[i].Acciones,
					nco: data[i].NumCompObservados,
					ncp: data[i].NumCompPositivos,
					IdDetObservacion: data[i].IdDetObservacion,
					IdEstandar: data[i].IdEstandar
				});
			}
			loadForm();
			loadEstandar();
		});
	}

	$scope.$on('$ionicView.enter', function(e) {
		init();
	});

	$scope.$on('$ionicView.afterEnter', function(event, viewData) {
		$timeout(function() {
			$ionicNavBarDelegate.align('center');
		}, 100);
	});

})

.controller('ObsPendientesCtrl', function($rootScope, $scope, $state, Observaciones, Estandares, DetObservaciones, $timeout, $ionicNavBarDelegate, $ionicPopup) {

	var count = 0;
	$scope.items = [];

	$scope.refresh = function() {
		$scope.items = [];
		init();
	};

	$scope.openDets = function(item) {
		$state.go('menu.det-observacion', {
			id_observacion: item.IdObservacion
		});
	};

	$scope.deleteObs = function(index, item) {
		$ionicPopup.confirm({
			title: 'Información',
			template: 'Estas seguro de eliminar la observación' + item.Lugar + '?'
		}).then(function(res) {
			if (res) {
				Observaciones.deleteById(item.IdObservacion);
				DetObservaciones.deleteAllById(item.IdObservacion);
				$scope.items.splice(index, 1);
			}
		});
	};

	function init() {
		$scope.items = [];
		$rootScope.$broadcast('loading:show');
		Observaciones.getAllDetPent().then(function(data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].registros > 0) {
					$scope.items.push(data[i]);
				} else {
					Observaciones.updateStatus(data[i].IdObservacion);
				}
			}
			$rootScope.$broadcast('loading:hide');
		});
	}
	$scope.$on('$ionicView.enter', function(e) {
		init();
	});
	$scope.$on('$ionicView.afterEnter', function(event, viewData) {
		$timeout(function() {
			$ionicNavBarDelegate.align('center');
		}, 100);
	});
})

.controller('ObsPorEnviarCtrl', function($rootScope, $scope, $state, Observaciones, Estandares, DetObservaciones,
	ObservacionesService, Lideres, $localstorage, $ionicPopup, ionicAuth, $timeout, $ionicNavBarDelegate) {
	var count = 0;
	$scope.items = [];
	$scope.isLogged = false;

	$scope.refresh = function() {
		$scope.items = [];
		init();
	};

	$scope.openDets = function(item) {
		$state.go('menu.det-observacion', {
			id_observacion: item.IdObservacion
		});
	};

	$scope.deleteObs = function(index, item) {
		$ionicPopup.confirm({
			title: 'Información',
			template: 'Estas seguro de eliminar la observación' + item.Lugar + '?'
		}).then(function(res) {
			if (res) {
				Observaciones.deleteById(item.IdObservacion);
				DetObservaciones.deleteAllById(item.IdObservacion);
				$scope.items.splice(index, 1);
			}
		});
	};

	$scope.save = function() {
		$ionicPopup.confirm({
			title: 'Información',
			template: 'Estas seguro de enviar las observaciones?'
		}).then(function(res) {
			if (res) {
				var item = null;
				var enviarLista = [];
				var user = $localstorage.getObject('UserPg');
				if (user === false) {
					$ionicPopup.alert({
						title: "Información",
						content: 'Debe iniciar sesión para poder enviar las observaciones'
					}).then(function() {
						$state.go('login');
					});
					return;
				}
				for (var i = 0; i < $scope.items.length; i++) {
					item = $scope.items[i];
					Observaciones.get(item.IdObservacion).then(function(obs) {
						$rootScope.$broadcast('loading:show');
						Lideres.getUser(user.id).then(function(data) {
							obs.IdLider = data.IdLider;
							obs.NombreUsuario = user.username;
							obs.movil = 1;
							var entry = new ObservacionesService(); //You can instantiate resource class
							entry = obs;
							DetObservaciones.getByIdObservacion(item.IdObservacion).then(function(alldet) {
								entry.DetObservaciones = alldet;
								enviarLista.push(entry);
								ObservacionesService.save(entry, function(res) {
									$rootScope.$broadcast('loading:hide');
									if (res.IdObservacion) {
										Observaciones.deleteById(item.IdObservacion);
										DetObservaciones.deleteAllById(item.IdObservacion);
										$scope.refresh();
									}
								}, function(resp) {
									$rootScope.$broadcast('loading:hide');
									$ionicPopup.alert({
										title: "Información",
										content: resp.Message
									});
								});
							});
						});
					});
				}
			}
		});
	};

	function init() {
		$scope.items = [];
		$rootScope.$broadcast('loading:show');
		Estandares.getAll().then(function(data1) {
			count = data1.length;
			Observaciones.getAllDetPorEnviar().then(function(data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].registros == count) {
						$scope.items.push(data[i]);
						Observaciones.updateStatus(data[i].IdObservacion);
					}
				}
				$rootScope.$broadcast('loading:hide');
			});
		});
	}
	$scope.$on('$ionicView.enter', function(e) {
		$scope.isLogged = ionicAuth.isAuthenticated();
		init();
	});
	$scope.$on('$ionicView.afterEnter', function(event, viewData) {
		$timeout(function() {
			$ionicNavBarDelegate.align('center');
		}, 100);
	});
})

.controller('ConfiguracionCtrl', function($rootScope, $scope, $ionicPopup, $cordovaNetwork, Empresas, EmpresasService, Lideres, LideresService,
	Parametros, ParametrosService, ValorParametros, ValorParametrosService, Estandares, EstandaresService, $timeout, $ionicNavBarDelegate, BASE_URL) {

	var promise = null;
	$scope.data = {
		url: ''
	};
	$scope.enableSync = false;

	function cargarEmpresas() {
		promise = EmpresasService.query().$promise;
		promise.then(function(data) {
			Empresas.truncate();
			for (var i = 0; i < data.length; i++) {
				Empresas.add({
					IdEmpresa: data[i].IdEmpresa,
					IdEstadoEmpresa: data[i].IdEstadoEmpresa,
					IdTipoEmpresa: data[i].IdTipoEmpresa,
					RazonSocial: data[i].RazonSocial
				});
			}
			cargarLideres();
		}, function(result) {
			$rootScope.$broadcast('loading:hide');
			$ionicPopup.alert({
				title: "Información",
				content: "Url no encontrada, por favor verifique si esta correcta"
			});
		});
	}

	function cargarLideres() {
		promise = LideresService.query().$promise;
		promise.then(function(data) {
			Lideres.truncate();
			for (var i = 0; i < data.length; i++) {
				Lideres.add({
					IdLider: data[i].IdLider,
					IdEmpresa: data[i].IdEmpresa,
					IdDependencia: data[i].IdDependencia,
					IdUsuario: data[i].IdUsuario,
					Nombre: data[i].Nombre,
					IdEstadoLider: data[i].IdEstadoLider,
					Usuario: data[i].Usuario,
				});
			}
			cargarParametros();
		});
	}

	function cargarParametros() {
		promise = ParametrosService.query().$promise;
		promise.then(function(data) {
			Parametros.truncate();
			for (var i = 0; i < data.length; i++) {
				Parametros.add({
					IdParametro: data[i].IdParametro,
					CodParametro: data[i].CodParametro,
					Atributo: data[i].Atributo,
					Descripcion: data[i].Descripcion,
					EstadoParametro: data[i].EstadoParametro
				});
			}
			cargarValorParametros();
		});
	}

	function cargarValorParametros() {
		promise = ValorParametrosService.query().$promise;
		promise.then(function(data) {
			ValorParametros.truncate();
			for (var i = 0; i < data.length; i++) {
				ValorParametros.add({
					IdValorParametro: data[i].IdValorParametro,
					IdParametro: data[i].IdParametro,
					CodValorParametro: data[i].CodValorParametro,
					CodParametro: data[i].CodParametro,
					Valor: data[i].Valor,
					Orden: data[i].Orden,
					EstadoValorParametro: data[i].EstadoValorParametro
				});
			}
			cargarEstandares();

		});
	}

	function cargarEstandares() {
		promise = EstandaresService.query().$promise;
		promise.then(function(data) {
			Estandares.truncate();
			for (var i = 0; i < data.length; i++) {
				Estandares.add({
					IdEstandar: data[i].IdEstandar,
					Descripcion: data[i].Descripcion,
					IdTipoEstandar: data[i].IdTipoEstandar,
					IdEstadoEstandar: data[i].IdEstadoEstandar
				});
			}
			$rootScope.$broadcast('loading:hide');
			$ionicPopup.alert({
				title: "Información",
				content: 'Sincronización Completa'
			});
		});
	}

	function init() {
		if (window.Connection) {
			var conn = $cordovaNetwork.getNetwork();
			if (conn == Connection.NONE) {
				$ionicPopup.alert({
					title: "Internet sin conexion",
					content: "El Dispositivo no tiene señal. Para continuar por favor conectese a una señaol WIFI o Datos Moviles"
				});
				$scope.enableSync = true;
				// listen for Online event
				$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
					$scope.enableSync = false;
				});
			}
		}
	}

	$scope.sincronizar = function() {
		$rootScope.$broadcast('loading:show');
		cargarEmpresas();
	};

	$scope.guardar = function() {
		$rootScope.$broadcast('loading:show');
		BASE_URL.url = $scope.data.url;
		localStorage.setItem('configuraciones', $scope.data.url);
		$rootScope.$broadcast('loading:hide');
		$ionicPopup.alert({
			title: "Actualización",
			content: "Url del servidor actualizada con exito"
		}).then(function() {
			window.location.reload();
		});
	};

	$scope.$on('$ionicView.enter', function(e) {
		init();
		$scope.data = {
			url: localStorage.getItem('configuraciones')
		};
	});

	init();

	$scope.$on('$ionicView.afterEnter', function(event, viewData) {
		$timeout(function() {
			$ionicNavBarDelegate.align('center');
		}, 100);
	});

});