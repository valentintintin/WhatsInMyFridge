angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $state) {
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState) {
                $scope.currentNavItem = toState.name;
            }
        )
    })

    .controller('FridgeCtrl', ['$scope', 'Datas', 'Product', 'Toast', 'DialogProduct', function ($scope, Datas, Product, Toast, DialogProduct) {
		$scope.products = Datas.getFridge().then(function(data) {
			$scope.products = data;
		});
		
		$scope.$watchCollection('products', function() {
			if ($scope.products != undefined) $scope.nbProducts = Object.keys($scope.products).length;
			else $scope.nbProducts = 0;
		});
		
        $scope.addProduct = function() {
            if (isMobile) {
                cordova.plugins.barcodeScanner.scan(function (result) {
                        if (result.text.length > 0) {
                            if ($scope.products[result.text] != undefined) $scope.products[result.text].plus();
                            else Datas.addProductToFridge(new Product(result.text));
                        }
                    }, function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            } else {
                var result = prompt("Code EAN");
                if (result) {
                    if ($scope.products[result] != undefined) $scope.products[result].plus();
                    else Datas.addProductToFridge(new Product(result));
                }
            }
        }

        $scope.showProduct = function(product, $event) {
            DialogProduct.show(product, $event);
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) {
                    DialogProduct.askBuy(product, function () {
                        Datas.addProductToShopping(product);
                    });
                    Datas.removeProductFromFridge(product);
                }
            } else product.plus();
        }
    }])

    .controller('ShoppingCtrl', ['$scope', 'Datas', 'Product', 'DialogProduct', function ($scope, Datas, Product, DialogProduct) {
        $scope.products = Datas.getShopping().then(function(data) {
			$scope.products = data;
		});
		
		$scope.$watchCollection('products', function() {
			if ($scope.products != undefined) $scope.nbProducts = Object.keys($scope.products).length;
			else $scope.nbProducts = 0;
		});

        $scope.addProduct = function() {
            if (isMobile) {
                cordova.plugins.barcodeScanner.scan(function (result) {
                        if ($scope.products[result.text] != undefined) $scope.products[result.text].plus();
                        else Datas.addProductToShopping(new Product(result.text, true));
                    }, function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            } else {
                var result = prompt("Code EAN");
                if (result) {
                    if ($scope.products[result] != undefined) $scope.products[result].plus();
                    else Datas.addProductToShopping(new Product(result, true));
                }
            }
        }

        $scope.showProduct = function(product, $event) {
            DialogProduct.show(product, $event);
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) Datas.removeProductFromShopping(product);
            } else product.plus();
        }
    }])

    .controller('MenusCtrl', ['$scope', 'Datas', 'Product', 'Dish', function ($scope, Datas, Product, Dish) {
        $scope.menus = Datas.getMenus();
    }])

    .controller('ShowProductCtrl', ['$scope', 'Datas', '$mdDialog', 'product', function ($scope, Datas, $mdDialog, product) {
        $scope.product = product;
        $scope.inFridgeBoolean = product.shopping;
		
		changeLabelSwitch();
		
		function changeLabelSwitch() {
			if (product.shopping) $scope.inFridge = 'In shopping list';
			else $scope.inFridge = 'In fridge';
		}
		
        $scope.setQty = function(minus) {
            if (minus) {
                if (product.minus()) {
                    if (product.shopping) Datas.removeProductFromShopping(product);
                    else {
                        DialogProduct.askBuy(product, function () {
                            Datas.addProductToShopping(product);
                        });
                        Datas.removeProductFromFridge(product);
                    }
                    $mdDialog.hide();
                }
            } else product.plus();
        }

        $scope.delete = function() {
			if (confirm("Remove the product ?")) {
				product.deleteFromDb();
				if (product.shopping) Datas.removeProductFromShopping(product);
				else Datas.removeProductFromFridge(product);

				$mdDialog.hide();
			}
        }

        $scope.close = function() {
            $mdDialog.hide();
        };

        $scope.onMarketChange = function() {
            product.deleteFromDb();
            if ($scope.inFridgeBoolean) {
                Datas.removeProductFromFridge(product);
                product.setShopping(true);
                Datas.addProductToShopping(product);
            } else {
                Datas.removeProductFromShopping(product);
                product.setShopping(false);
                Datas.addProductToFridge(product);
            }
			changeLabelSwitch();
        };
    }]);