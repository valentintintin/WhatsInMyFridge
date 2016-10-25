angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope) {
        $scope.currentNavItem = "fridge";
    })

    .controller('FridgeCtrl', ['$scope', 'Datas', 'Product', function ($scope, Datas, Product) {
        $scope.products = Datas.fridge;

        $scope.addProduct = function() {
            alert(startScan());
        }
    }])

    .controller('MarketCtrl', ['$scope', 'Datas', 'Product', function ($scope, Datas, Product) {
        $scope.products = Datas.market;

        $scope.addProduct = function() {
        }
    }])

    .controller('MenusCtrl', ['$scope', 'Datas', 'Product', 'Dish', function ($scope, Datas, Product, Dish) {
        $scope.menus = Datas.menus;
    }]);


 function startScan() {
    //TODO check if mobile to enter the function ! Otherwise it throws error about cordova undefined
    cordova.plugins.barcodeScanner.scan(function (result) {
            return result.text;
        }, function (error) {
            alert("Scanning failed: " + error);
            return undefined;
        }
    );
}