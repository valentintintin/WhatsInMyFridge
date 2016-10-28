angular.module('App.services', [])

    .factory('Datas', ['Product', 'Menu', 'Dish', '$http', function(Product, Menu, Dish, $http) {

        var datas = {
            fridge: {},
            market: {},
            menus: {}
        };

        $http.get(URL_SERVER + "fridge/")
            .then(function (response) {
                response.data.forEach(function (obj) {
                    datas.fridge[obj.code] = new Product(obj.code, obj.qty, false, obj.name, obj.image);
                });
            }, function () {
            alert("bug getFridge");
        });

        $http.get(URL_SERVER + "market/")
            .then(function (response) {
                response.data.forEach(function (obj) {
                    datas.market[obj.code] = new Product(obj.code, obj.qty, true, obj.name, obj.image);
                });
            }, function () {
            alert("bug getMarket");
            });

        return {
            getFridge: function() { return datas.fridge; },
            addProductToFridge: function(product) { datas.fridge[product.code] = product; },
            removeProductFromFridge: function(product) { delete datas.fridge[product.code]; },

            getMarket: function() { return datas.market; },
            addProductToMarket: function(product) { datas.market[product.code] = product; },
            removeProductFromMarket: function(product) { delete datas.market[product.code]; },

            getMenus: function() { return datas.menus; },
        };
    }])

    .service('Toast', ['$mdToast', function($mdToast) {
        this.show = function(message, time) {
            if (time == undefined) time = 1500;
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .hideDelay(time)
            );
        };
    }])

    .service('DialogProduct', ['$mdDialog', function($mdDialog) {
        this.show = function(product, $event) {
            $mdDialog.show({
                templateUrl: 'views/showProduct.html',
                targetEvent: $event,
                clickOutsideToClose:true,
                controller: 'ShowProductCtrl',
                locals: {
                    product: product
                }
            });
        };

        this.askName = function(product) {
            var confirm = $mdDialog.prompt()
                .title('Name the product')
                .textContent('OpenFoodFacts service doesn\'t know the product.')
                .placeholder('Product name')
                .ariaLabel('Product name')
                .ok('Done !');

            $mdDialog.show(confirm).then(function(result) {
                product.setName(result);
            });
        };

        this.askBuy = function(product, callback) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to buy it next time ?')
                .textContent('Place the product in your shopping list.')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                product.setMarket(true);
                callback();
            });
        }
    }])
;

//http://www.jsoneditoronline.org/?url=http://world.openfoodfacts.org/api/v0/product/3041831120038.json
