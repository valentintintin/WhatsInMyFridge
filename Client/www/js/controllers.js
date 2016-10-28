angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope) {
        $scope.currentNavItem = "fridge";

        console.log(ionic.Platform.platform());
    })

    .controller('FridgeCtrl', ['$scope', 'Datas', 'Product', 'Toast', '$mdDialog', function ($scope, Datas, Product, Toast, $mdDialog) {
        $scope.products = Datas.getFridge();
        $scope.productSelected = undefined;

        $scope.addProduct = function() {
            //TODO check if mobile to enter the function ! Otherwise it throws error about cordova undefined
            cordova.plugins.barcodeScanner.scan(function (result) {
                    if (Datas.getFridge()[result.text] != undefined) Datas.getFridge()[result.text].plus();
                    else Datas.addProductToFridge(new Product(result.text));
                }, function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        }

        $scope.showProduct = function(product, $event) {
            $scope.productSelected = product;
            $mdDialog.show({
                templateUrl: 'views/showProduct.html',
                targetEvent: $event,
                clickOutsideToClose:true,
                controller: 'ShowProductCtrl',
                locals: {
                    product: $scope.productSelected
                }
            });
        }

        $scope.setQty = function(product, minus) {
            if (minus) {
                if (product.minus()) {
                    product.deleteFromDb();

                    if (confirm("Buy again ?")) {
                        product.qty = 1;
                        product.setMarket(true);
                        Datas.addProductToMarket(product);
                    }

                    Datas.removeProductFromFridge(product);
                } else {
                    product.saveChanges();
                }
            } else product.plus();
        }
    }])

    .controller('MarketCtrl', ['$scope', 'Datas', 'Product', function ($scope, Datas, Product) {
        $scope.products = Datas.getMarket();

        $scope.addProduct = function() {
            //TODO check if mobile to enter the function ! Otherwise it throws error about cordova undefined
            cordova.plugins.barcodeScanner.scan(function (result) {
                    if (Datas.getMarket()[result.text] != undefined) Datas.getMarket()[result.text].plus();
                    else Datas.addProductToMarket(new Product(result.text));
                }, function (error) {
                    alert("Scanning failed: " + error);
                }
            );
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

    .controller('ShowProductCtrl', ['$scope', 'Datas', '$mdDialog', function ($scope, Datas, $mdDialog, product) {
        console.log(product);
        $scope.product = product;

        $scope.setQty = function(minus) {
            if (minus) {
                if ($scope.product.minus()) {
                    $scope.product.deleteFromDb();
                    if ($scope.product.getMarket()) Datas.removeProductFromMarket($scope.product);
                    else Datas.removeProductFromFridge($scope.product);
                } else {
                    $scope.product.saveChanges();
                }
            } else $scope.product.plus();
        }

        $scope.delete = function() {
            $scope.product.deleteFromDb();
            if ($scope.product.getMarket()) Datas.removeProductFromMarket($scope.product);
            else Datas.removeProductFromFridge($scope.product);
        }

        $scope.close = function() {
            $mdDialog.hide();
        };
    }]);