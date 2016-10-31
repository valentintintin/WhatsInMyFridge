angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, Datas) {
        Datas.init();

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState) {
                $scope.currentNavItem = toState.name;
            }
        )
    })

    .controller('FridgeCtrl', function ($scope, Datas, Product, DialogProduct) {
		$scope.products = Datas.getFridge();
		
		$scope.$watchCollection('products', function() {
			if ($scope.products != undefined) $scope.nbProducts = Object.keys($scope.products).length;
			else $scope.nbProducts = 0;
		});
		
        $scope.addProduct = function() {
            DialogProduct.addProduct(function (code) {
                if ($scope.products[code] != undefined) $scope.products[code].plus();
                else Datas.addProductToFridge(new Product(code));

                var productShopping = Datas.getShopping()[code];
                if (productShopping != undefined) {
                    if (confirm("This product is on your shopping list, would you like to remove one ?")) {
                        if (productShopping.minus()) Datas.removeProductFromShopping(productShopping);
                    }
                }
            });
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
    })

    .controller('ShoppingCtrl', function ($scope, Datas, Product, DialogProduct) {
        $scope.products = Datas.getShopping();
		
		$scope.$watchCollection('products', function() {
			if ($scope.products != undefined) $scope.nbProducts = Object.keys($scope.products).length;
			else $scope.nbProducts = 0;
		});

        $scope.addProduct = function() {
            DialogProduct.addProduct(function (code) {
                if ($scope.products[code] != undefined) $scope.products[code].plus();
                else Datas.addProductToShopping(new Product(code));
            });
        }

        $scope.showProduct = function(product, $event) {
            DialogProduct.show(product, $event);
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) Datas.removeProductFromShopping(product);
            } else product.plus();
        }
    })

    .controller('MenusCtrl', function ($scope, Datas, Product, Dish) {
        $scope.menus = Datas.getMenus();
    })

    .controller('ShowProductCtrl', function ($scope, Datas, $mdDialog, product) {
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
    });