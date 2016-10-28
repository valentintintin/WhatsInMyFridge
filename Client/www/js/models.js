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

    .factory('Product', function ($http, Toast) {
        function Product(code, qty, market, name, image) {
            this.code = code;
            if (qty != undefined) this.qty = qty;
            else this.qty = 1;
            this.inBase = false;
            this.name = undefined;
            this.image = undefined;
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
                    Toast.inform("bug retrieve product from server for add");
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
                this.inBase = false;
                this.saveChanges();
            },
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
                            self.image = product.image_small_url;

                            //TODO debug
                            console.log(JSON.stringify(self));
                        } else if (promptEnable) {
                            self.askName();
                        }

                        self.saveChanges();
                    }, function () {
                        if (promptEnable) {
                            self.askName();
                        }

                        self.saveChanges();
                });
            },

            askName: function () {
                this.name = prompt("Product name: ");
                if (this.name == "") this.name = this.code;
            },

            saveChanges: function () {
                if (!this.inBase) {
                    //TODO debug
                    console.log(JSON.stringify(this));
                    var self = this;
                    $http.post(URL_SERVER + "product", JSON.stringify(this))
                        .then(function (response) {
                            if (!response.data) Toast.inform("bug addProduct data");
                            else {
                                $http.post(self.getUrlServer(), JSON.stringify(self))
                                    .then(function (response) {
                                        if (!response.data) Toast.inform("bug addProduct");
                                        else {
                                            self.inBase = true;
                                            Toast.inform("Added !", 300);
                                        }
                                    }, function () {
                                        Toast.inform("bug addProduct");
                                });
                            }
                        }, function () {
                            Toast.inform("bug addProduct data");
                    });
                } else {
                    $http.put(this.getUrlServer() + this.code, JSON.stringify(this))
                        .then(function (response) {
                            if (!response.data) Toast.inform("bug updateProduct");
                            else Toast.inform("Saved !", 300);
                        }, function () {
                            Toast.inform("bug updateProduct");
                    });
                }
            },

            deleteFromDb: function () {
                $http.delete(this.getUrlServer() + this.code)
                    .then(function () {
                        if (!response.data) Toast.inform("bug deleteProduct");
                    }, function () {
                    Toast.inform("bug deleteProduct");
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
