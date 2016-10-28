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
			$scope.nbProducts = Object.keys($scope.products).length;
		});
		
        $scope.addProduct = function() {
            //TODO check if mobile to enter the function ! Otherwise it throws error about cordova undefined
            cordova.plugins.barcodeScanner.scan(function (result) {
                    if ($scope.products[result.text] != undefined) $scope.products[result.text].plus();
                    else Datas.addProductToFridge(new Product(result.text));
                }, function (error) {
                    alert("Scanning failed: " + error);
                }
            );
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

    .controller('MarketCtrl', ['$scope', 'Datas', 'Product', function ($scope, Datas, Product) {
        $scope.products = Datas.getMarket().then(function(data) {
			$scope.products = data;
		});
		
		$scope.$watchCollection('products', function() {
			$scope.nbProducts = Object.keys($scope.products).length;
		});

        $scope.addProduct = function() {
            //TODO check if mobile to enter the function ! Otherwise it throws error about cordova undefined
            cordova.plugins.barcodeScanner.scan(function (result) {
                    if ($scope.products[result.text] != undefined) $scope.products[result.text].plus();
                    else Datas.addProductToMarket(new Product(result.text));
                }, function (error) {
                    alert("Scanning failed: " + error);
                }
            );
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
            $scope.product.deleteFromDb();
            if ($scope.product.isMarket()) Datas.removeProductFromMarket($scope.product);
            else Datas.removeProductFromFridge($scope.product);

            $mdDialog.hide();
        }

        $scope.close = function() {
            $mdDialog.hide();
        };
    }]);