angular.module('App.services', [])

    .factory('Datas', function(Product, Menu, Dish, $http, Toast) {
        var fridge = {};
		var shopping = {};
		var menus = {};
        var users = {};

        return {
            init: function() {
                $http.get(URL_SERVER + "fridge")
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug getFridge");
                        } else {
                            angular.forEach(response.data, function (product, id) {
                                fridge[id] = new Product(id, false, product.quantity, product.name, product.image);
                            });
                        }
                        return fridge;
                    }, function () {
                        Toast.show("bug getFridge");
                    });

                $http.get(URL_SERVER + "shopping")
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug getShopping");
                        } else {
                            angular.forEach(response.data, function (product, id) {
                                shopping[id] = new Product(id, true, product.quantity, product.name, product.image);
                            });
                        }

                        return shopping;
                    }, function () {
                        Toast.show("bug getShopping");
                    });

                $http.get(URL_SERVER + "user")
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug getUser");
                        } else {
                            angular.forEach(response.data, function (user, id) {
                                users[id] = user
                            });
                        }

                        return users;
                    }, function () {
                        Toast.show("bug getUser");
                    });
            },
			getFridge: function() { return fridge; },
            addProductToFridge: function(product) { fridge[product.id] = product; },
            removeProductFromFridge: function(product) { delete fridge[product.id]; },

            getShopping: function() { return shopping; },
            addProductToShopping: function(product) { shopping[product.id] = product; },
            removeProductFromShopping: function(product) { delete shopping[product.id]; },

            getMenus: function() { return menus; },

            getUser: function() { return users; },
        };
    })

    .service('Toast', function($mdToast) {
        this.show = function(message, time) {
            if (time == undefined) time = 1500;
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .hideDelay(time)
            );
        };
    })

    .service('DialogProduct', function($mdDialog) {
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
                if (result) {
                    product.name = result;
                    product.createInDb();
                }
            });
        };

        this.askBuy = function(product, callback) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to buy it next time ?')
                .textContent('Place the product in your shopping list.')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                product.setShopping(true);
                callback();
            });
        };

        this.addProduct = function (callback) {
            var code = undefined;

            if (isMobile) {
                cordova.plugins.barcodeScanner.scan(function (result) {
                    code = result.text;
                    if (code) callback(code);
                }, function (error) {
                    alert("Scanning failed: " + error);
                });
            } else {
                code = prompt("Code EAN");
                if (code) callback(code);
            }
        };
    })
;

//http://www.jsoneditoronline.org/?url=http://world.openfoodfacts.org/api/v0/product/3222472863618.json
