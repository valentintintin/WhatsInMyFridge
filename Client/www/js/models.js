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
        function Product(id, quantity, shopping, name, image) {
            this.id = id;
            if (quantity != undefined) this.quantity = quantity;
            else this.quantity = 1;
            this.name = "";
            this.image = "";
            this.shopping = shopping;
            this.show = true;

            if (name == undefined && image == undefined) {
                var self = this;

                $http.get(URL_SERVER + "product/" + this.id)
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug retrieve product from server for add");
                            DialogProduct.askName(self);
                        } else {
                            var p = response.data;
                            if (p.name != undefined) {
                                self.name = p.name;
                                self.image = p.image;
                                self.insertInDb();
                            } else {
                                DialogProduct.askName(self);
                            }
                        }
                    }, function () {
                    Toast.show("bug retrieve product from server for add");
                    DialogProduct.askName(self);
                });
            } else {
                this.name = name;
                this.image = image;
            }
        }

        Product.prototype = {
            setShopping: function(market) {
                this.show = false;
                this.shopping = market;
                this.quantity = 1;
                this.insertInDb();
            },

            getUrlServer: function(id) {
                return URL_SERVER + (this.shopping ? 'shopping' : 'fridge') + (id ? "/" + this.id : "");
            },

            createInDb: function() {
                var self = this;
                $http.post(URL_SERVER + "product", this.getJSON(true))
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug addProduct data");
                        } else self.insertInDb();
                    }, function () {
                        Toast.show("bug addProduct data");
                    });
            },

            insertInDb: function() {
                var self = this;
                $http.post(self.getUrlServer(), self.getJSON())
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug addProduct");
                        } else {
                            if (self.show) DialogProduct.show(self);
                            Toast.show("Added !");
                            self.show = true;
                        }
                    }, function () {
                        Toast.show("bug addProduct");
                    });
            },

            updateInDb: function () {
                $http.put(this.getUrlServer(true), this.getJSON())
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug updateProduct");
                        } else Toast.show("Saved !", 300);
                    }, function () {
                        Toast.show("bug updateProduct");
                });
            },

            deleteFromDb: function () {
                $http.delete(this.getUrlServer(true))
                    .then(function (response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            alert(JSON.stringify(response.data.error));
                            Toast.show("bug deleteProduct");
                        } else Toast.show("Deleted !", 300);
                    }, function () {
                    Toast.show("bug deleteProduct");
                });
            },

            minus: function () {
                this.quantity--;
                if (this.quantity <= 0) {
                    this.deleteFromDb();
                    return true;
                } else {
                    this.updateInDb();
                    return false;
                }
            },

            plus: function () {
                this.quantity++;
                this.updateInDb();
            },

            getJSON: function(product) {
                if (product) return JSON.stringify({id: this.id, name: this.name, image: (this.image ? this.image : undefined)});
                else return JSON.stringify({product_id: this.id, user_id: 1, quantity: this.quantity});
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
            add: function (product, quantity) {
                if (this.quantity == undefined) quantity = 1;

                if (this.dish[product.id] != undefined) this.dish[product.id].plus();
                else this.dish[product.id] = new Dish(this, product, quantity);
            },

            remove: function (dish) {
                this.dish[dish.product.id].dispose();
                delete this.dish[dish.product.id];
            },

            dispose: function () {
                for (dish in this.dish) this.dish[dish].dispose();
            }
        };

        return Menu;
    }])

    .factory('Dish', ['Product', function (Product) {
        function Dish(menu, product, quantity) {
            this.menu = menu;
            this.product = product;
            if (this.quantity != undefined) this.quantity = quantity;
            else this.quantity = 1;
            this.product.quantity -= this.quantity;
        }

        Dish.prototype = {
            minus: function () {
                this.quantity--;
                this.product.plus();

                if (this.quantity <= 0) {
                    this.menu.remove(this);
                }
            },

            plus: function () {
                this.quantity++;
                this.product.minus();
            },

            dispose: function () {
                this.product.quantity += this.quantity;
            }
        };

        return Dish;
    }]);
