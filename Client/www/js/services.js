angular.module('App.services', [])

    .factory('Datas', ['Product', 'Menu', 'Dish', '$http', function (Product, Menu, Dish, $http) {

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
            }), function () {
            alert("bug getFridge");
        };

        $http.get(URL_SERVER + "market/")
            .then(function (response) {
                response.data.forEach(function (obj) {
                    datas.market[obj.code] = new Product(obj.code, obj.qty, true, obj.name, obj.image);
                });
            }), function () {
            alert("bug getMarket");
        };

        return datas;
    }]);

//http://www.jsoneditoronline.org/?url=http://world.openfoodfacts.org/api/v0/product/3041831120038.json
