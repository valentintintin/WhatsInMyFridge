angular.module('App.models', [])

    .directive('listproducts', function () {
        return {
            restric: 'E',
            replace: true,
            templateUrl: 'views/listProducts.html'
        };
    })

    .directive('addbuttonfloat', function () {
        return {
            restric: 'E',
            replace: true,
            templateUrl: 'views/addButtonFloat.html'
        };
    })

    .factory('Product', function ($http, Toast, DialogProduct) {
        function Product(code, qty, market, name, image) {
            this.code = code;
            if (qty != undefined) this.qty = qty;
            else this.qty = 1;
            this.inBase = false;
            this.name = "";
            this.image = "";
            this.market = market;

            if (name == undefined && image == undefined) {
                var self = this;

                $http.get(URL_SERVER + "product/" + this.code)
                    .then(function (response) {
                        var p = response.data;
                        if (p.name != undefined && p.image != undefined) {
                            self.name = p.name;
                            self.image = p.image;
                            self.saveChanges();
                        } else {
                            self.getFromOpenFood(true);
                        }
                    }, function () {
                    Toast.show("bug retrieve product from server for add");
                });
            } else {
                this.name = name;
                this.image = image;

                if (!this.inBase && this.image == undefined) this.getFromOpenFood(false);

                this.inBase = true;
            }
        }

        Product.prototype = {
            setMarket: function (market) {
                this.market = market;
                this.qty = 1;
                this.inBase = false;
                this.saveChanges();
            },

            isMarket: function() { return this.market; },

            getUrlServer: function () {
                return URL_SERVER + (this.market ? 'market' : 'fridge') + "/"
            },

            getFromOpenFood: function (promptEnable) {
                var self = this;
                $http.get("http://world.openfoodfacts.org/api/v0/product/" + this.code)
                    .then(function (response) {
                        if (response.data.product != undefined && response.data.product.code != "") {
                            product = response.data.product;
                            if (product.product_name_fr != undefined) self.name = product.product_name_fr;
                            else self.name = product.product_name;

                            if (product.image_small_url != undefined) self.image = product.image_small_url;
                            else self.image = "";

                            self.saveChanges();
                        } else if (promptEnable) {
                            DialogProduct.askName(self);
                        }

                    }, function () {
                        if (promptEnable) DialogProduct.askName(self);
                        else self.saveChanges();
                });
            },

            saveChanges: function () {
                if (!this.inBase) {
                    var self = this;
                    $http.post(URL_SERVER + "product", JSON.stringify(this))
                        .then(function (response) {
                            if (!response.data) Toast.show("bug addProduct data");
                            else {
                                $http.post(self.getUrlServer(), JSON.stringify(self))
                                    .then(function (response) {
                                        if (!response.data) Toast.show("bug addProduct");
                                        else {
                                            self.inBase = true;
                                            DialogProduct.show(self);
                                            Toast.show("Added !");
                                        }
                                    }, function () {
                                        Toast.show("bug addProduct");
                                });
                            }
                        }, function () {
                            Toast.show("bug addProduct data");
                    });
                } else {
                    $http.put(this.getUrlServer() + this.code, JSON.stringify(this))
                        .then(function (response) {
                            if (!response.data) Toast.show("bug updateProduct");
                            else Toast.show("Saved !", 300);
                        }, function () {
                            Toast.show("bug updateProduct");
                    });
                }
            },

            deleteFromDb: function () {
                $http.delete(this.getUrlServer() + this.code)
                    .then(function (response) {
                        if (!response.data) Toast.show("bug deleteProduct");
                        else Toast.show("Deleted !", 300);
                    }, function () {
                    Toast.show("bug deleteProduct");
                });
            },

            minus: function () {
                this.qty--;
                return this.qty <= 0;
            },

            plus: function () {
                this.qty++;
                this.saveChanges();
            }
        };

        return Product;
    })

    .factory('Menu', ['Dish', function (Dish) {
        function Menu(date) {
            this.date = date;
            this.dish = {};
        }

        Menu.prototype = {
            add: function (product, qty) {
                if (this.qty == undefined) qty = 1;

                if (this.dish[product.code] != undefined) this.dish[product.code].plus();
                else this.dish[product.code] = new Dish(this, product, qty);
            },

            remove: function (dish) {
                this.dish[dish.product.code].dispose();
                delete this.dish[dish.product.code];
            },

            dispose: function () {
                for (dish in this.dish) this.dish[dish].dispose();
            }
        };

        return Menu;
    }])

    .factory('Dish', ['Product', function (Product) {
        function Dish(menu, product, qty) {
            this.menu = menu;
            this.product = product;
            if (this.qty != undefined) this.qty = qty;
            else this.qty = 1;
            this.product.qty -= this.qty;
        }

        Dish.prototype = {
            minus: function () {
                this.qty--;
                this.product.plus();

                if (this.qty <= 0) {
                    this.menu.remove(this);
                }
            },

            plus: function () {
                this.qty++;
                this.product.minus();
            },

            dispose: function () {
                this.product.qty += this.qty;
            }
        };

        return Dish;
    }]);
