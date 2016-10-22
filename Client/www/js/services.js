angular.module('starter.services', [])

.factory('Chats', ['$http', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = {
    products: {}
  };

  $http.get("http://77.204.229.132/api/" + "fridge/")
      .then(function(response) {
        response.data.forEach(function(obj){
          chats.products[obj.code] = {code: obj.code, qty: obj.qty, market: false, name: obj.name, image: obj.image};
        });
      }), function() {
    alert("bug getFridge");
  };

  return chats;
}]);
