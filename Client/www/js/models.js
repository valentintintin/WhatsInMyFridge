app.directive('listproducts', function() {
	return {
		restric: 'E',
		replace: true,
		scope: {
			from: '@'
		},
		templateUrl: 'views/listProducts.html',
		controller: 'productsCtrl',
		controllerAs: 'ctrl'
	};	
});

app.factory('Product', function($http) {
	function Product(code, qty = 1, market, name, image) {
		this.code = code;
		this.qty = qty;
		this.inBase = false;
		this.name = undefined;
		this.image = undefined;
		this.market = market;

		if (name == undefined && image == undefined) {
			var self = this;

			$http.get(URL_SERVER + "product/" + this.code)
			.then(function(response) {
				var p = response.data;
				if (p.name != undefined && p.image != undefined) {
					self.name = p.name;
					self.image = p.image;
					self.saveChanges();
				} else {
					self.getFromOpenFood(true);
				}
			}), function() {
				alert("bug retrieve product from server for add");
			}
		} else {
			this.name = name;
			this.image = image;

			if (!this.inBase && this.image == undefined) this.getFromOpenFood(false);

			this.inBase = true;
		}
	}

	Product.prototype = {
		setMarket: function(market) { this.market = market },
		getUrlServer: function() { return URL_SERVER + (this.market ? 'market' : 'fridge') + "/" },

		getFromOpenFood: function(promptEnable) {
			var self = this;
			$http.get("http://world.openfoodfacts.org/api/v0/product/" + this.code)
			.then(function(response) {
				if (response.data.product != undefined && response.data.product.code != "") {
					product = response.data.product;
					if (product.product_name_fr != undefined) self.name = product.product_name_fr;
					else self.name = product.product_name;
					self.image = product.image_small_url;

          console.log(JSON.stringify(self));
				} else if (promptEnable) {
          self.askName();
				}

        self.saveChanges();
			}), function() {
				if (promptEnable) {
          self.askName();
				}

        self.saveChanges();
			};
		},

    askName: function() {
		  this.name = prompt("Product name: ");
      if (this.name == "") this.name = this.code;
    },

		saveChanges: function() {
			if (!this.inBase) {
			  console.log(JSON.stringify(this));
				$http.post(this.getUrlServer(), JSON.stringify(this))
				.then(function() {
					p.inBase = true;
				}), function() {
					alert("bug addProduct");
				};
			} else {
				$http.put(this.getUrlServer() + this.code, JSON.stringify(this))
				.then(function() {
				}), function() {
					alert("bug updateProduct");
				};
			}
		},

		deleteFromDb: function() {
			$http.delete(this.getUrlServer() + this.code)
			.then(function() {
			}), function() {
				alert("bug deleteProduct");
			};
		},

		minus: function() {
			this.qty--;
			this.saveChanges();
			return this.qty <= 0;
		},

		plus: function() {
			this.qty++;
			this.saveChanges();
		}
	};

	return Product;
});

app.factory('Menu', ['Dish', function(Dish) {
	function Menu(date) {
		this.date = date;
		this.dish = {};
	}

	Menu.prototype = {
		add: function(product, qty = 1) {
			if (this.dish[product.code] != undefined) this.dish[product.code].plus();
			else this.dish[product.code] = new Dish(this, product, qty);
		},

		remove: function(dish) {
			this.dish[dish.product.code].dispose();
			delete this.dish[dish.product.code];
		},

		dispose: function() {
			for (dish in this.dish) this.dish[dish].dispose();
		}
	};

	return Menu;
}]);

app.factory('Dish', ['Product', function(Product) {
	function Dish(menu, product, qty = 1) {
		this.menu = menu;
		this.product = product;
		this.product.qty -= qty;
		this.qty = qty;
	}

	Dish.prototype = {
		minus: function() {
			this.qty--;
			this.product.plus();

			if (this.qty <= 0) {
				this.menu.remove(this);
			}
		},

		plus: function() {
			this.qty++;
			this.product.minus();
		},

		dispose: function() {
			this.product.qty += this.qty;
		}
	};

	return Dish;
}]);
