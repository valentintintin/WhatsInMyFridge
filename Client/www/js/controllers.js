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
                if ($scope.products[result] != undefined) $scope.products[result].plus();
                else Datas.addProductToFridge(new Product(result));
            }
        }

        $scope.showProduct = function(product, $event) {
            DialogProduct.show(product, $event);
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) {
                    product.deleteFromDb();

                    DialogProduct.askBuy(product, function () {
                        Datas.addProductToMarket(product);
                    });
                    Datas.removeProductFromFridge(product);
                } else {
                    product.saveChanges();
                }
            } else product.plus();
        }
    }])

    .controller('MarketCtrl', ['$scope', 'Datas', 'Product', 'DialogProduct', function ($scope, Datas, Product, DialogProduct) {
        $scope.products = Datas.getMarket().then(function(data) {
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
                        else Datas.addProductToMarket(new Product(result.text, 1, true));
                    }, function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            } else {
                var result = prompt("Code EAN");
                if ($scope.products[result] != undefined) $scope.products[result].plus();
                else Datas.addProductToMarket(new Product(result));
            }
        }

        $scope.showProduct = function(product, $event) {
            DialogProduct.show(product, $event);
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) {
                    product.deleteFromDb();
                    Datas.removeProductFromMarket(product);
                } else {
                    product.saveChanges();
                }
            } else product.plus();
        }
    }])

    .controller('MenusCtrl', ['$scope', 'Datas', 'Product', 'Dish', function ($scope, Datas, Product, Dish) {
        $scope.menus = Datas.getMenus();
    }])

    .controller('ShowProductCtrl', ['$scope', 'Datas', '$mdDialog', 'product', function ($scope, Datas, $mdDialog, product) {
        $scope.product = product;

        $scope.setQty = function(minus) {
            if (minus) {
                if ($scope.product.minus()) {
                    $scope.product.deleteFromDb();
                    if ($scope.product.isMarket()) Datas.removeProductFromMarket($scope.product);
                    else {
                        DialogProduct.askBuy(product, function () {
                            Datas.addProductToMarket(product);
                        });
                        Datas.removeProductFromFridge($scope.product);
                    }
                } else {
                    $scope.product.saveChanges();
                }
            } else $scope.product.plus();
        }

        $scope.delete = function() {
			if (confirm("Remove the product ?")) {
				$scope.product.deleteFromDb();
				if ($scope.product.isMarket()) Datas.removeProductFromMarket($scope.product);
				else Datas.removeProductFromFridge($scope.product);

				$mdDialog.hide();
			}
        }

        $scope.close = function() {
            $mdDialog.hide();
        };
    }]);