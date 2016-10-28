angular.module('App.services', [])

    .factory('Datas', ['Product', 'Menu', 'Dish', '$http', 'Toast', function(Product, Menu, Dish, $http, Toast) {
        var fridge = {};
		var market = {};
		var menus = {};

        return {
			getFridge: function() {
				return $http.get(URL_SERVER + "fridge/")
					.then(function (response) {
						response.data.forEach(function (obj) {
							fridge[obj.code] = new Product(obj.code, obj.qty, false, obj.name, obj.image);
						});
						
						return fridge;
					}, function () {
					Toast.show("bug getFridge");
				});
			},
            addProductToFridge: function(product) { fridge[product.code] = product; },
            removeProductFromFridge: function(product) { delete fridge[product.code]; },

            getMarket: function() {
				return $http.get(URL_SERVER + "market/")
					.then(function (response) {
						response.data.forEach(function (obj) {
							market[obj.code] = new Product(obj.code, obj.qty, true, obj.name, obj.image);
						});
						
						return market;
					}, function () {
					Toast.show("bug getMarket");
				});
			},			
            addProductToMarket: function(product) { market[product.code] = product; },
            removeProductFromMarket: function(product) { delete market[product.code]; },

            getMenus: function() { return menus; },
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
                if (result.length == 0) result = product.code;
                product.name = result;
                product.saveChanges();
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

//http://www.jsoneditoronline.org/?url=http://world.openfoodfacts.org/api/v0/product/3222472863618.json
