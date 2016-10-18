app.controller("productsCtrl", function($scope, Datas, Product){
	$scope.products = Datas.products;
	$scope.productsToBuy = Datas.productsToBuy;

  $scope.startScan = function() {
    var scope = $scope;
    cordova.plugins.barcodeScanner.scan(function (result) {
        scope.codeProduct = result.text;
        scope.add();
      }, function (error) {
        alert("Scanning failed: " + error);
      }
    );
  }

	$scope.add = function() {
		if (Datas.products[$scope.codeProduct] != undefined) Datas.products[$scope.codeProduct].plus();
		else Datas.products[$scope.codeProduct] = new Product($scope.codeProduct, 1, false);
		$scope.codeProduct = "";
	}

  $scope.startScanBuy = function() {
    cordova.plugins.barcodeScanner.scan(function (result) {
        $scope.codeProductToBuy = result.text;
        $scope.addToBuy();
      }, function (error) {
        alert("Scanning failed: " + error);
      }
    );
  }

	$scope.addToBuy = function() {
		if (Datas.productsToBuy[$scope.codeProductToBuy] != undefined) Datas.productsToBuy[$scope.codeProductToBuy].plus();
		else Datas.productsToBuy[$scope.codeProductToBuy] = new Product($scope.codeProductToBuy, 1, true);
		$scope.codeProductToBuy = "";
	}

	$scope.setQty = function(product, minus) {
		if (minus) {
			if (product.minus()) {
				if (confirm("Buy again ?")) {
					product.qty = 1;
					product.setMarket(true);
					Datas.productsToBuy[product.code] = product;
				}

				product.deleteFromDb();
				delete Datas.products[product.code];
			}
		} else product.plus();
	}

	$scope.setQtyToBuy = function(product, minus) {
		if (minus) {
			if (product.minus()) {
				product.deleteFromDb();
				delete Datas.productsToBuy[product.code];
			}
		} else product.plus();
	}
});
