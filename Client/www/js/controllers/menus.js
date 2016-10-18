app.controller("menusCtrl", function($scope, Datas, Menu, Dish){
	$scope.menus = Datas.menus;
	$scope.products = Datas.products;
	
	$scope.addNewMenu = function() {
		$scope.dateMenu = $scope.dateMenu.charAt(0).toUpperCase() + $scope.dateMenu.toLowerCase().slice(1);
		if (Datas.menus[$scope.dateMenu] == undefined) {
			Datas.menus[$scope.dateMenu] = new Menu($scope.dateMenu);
			$scope.dateMenu = "";
		} else alert('Already exist !');
	}
	
	$scope.removeMenu = function(menu) {
		menu.dispose();
		delete Datas.menus[menu.date];
	}
});