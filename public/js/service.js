var boatService = angular.module('boatModule', ['commonUIModule'])
boatService.service('boatCoreService', function($http, $q, $rootScope, commonUIService){
  function boatCoreService ($http, $q){
    this.boatId = '',
    this.header = { 'Content-Type' : 'application/json' };
  }

  boatCoreService.prototype.getAll = function getAll(){
    var deferred = $q.defer();
    var body={};
    var url = commonUIService.URL.GET_BOATS.baseUrl;
    $http.get(url, this.header).then(
      function (response){
        deferred.resolve(response.data);
      },
      function(error) {
        commonUIService.showNotifyMessage('Cannot not load boat list');
      }
    );
    return deferred.promise;
  }

  boatCoreService.prototype.addBoat = function addBoat(boatName, file) {
    var deferred = $q.defer();
    var reader = new FileReader();
    var config = { 'Content-Type' : undefined };
    var body={
      "name" : boatName,
      "image" : file
    };
    var url = commonUIService.URL.ADD_BOAT.baseUrl;
    $http.post(url, body, {
      transformRequest: function (data, headersGetter) {
        var formData = new FormData();
        
        formData.append("name", data.name);
        formData.append("image", data.image);
        var headers = headersGetter();

        return formData;
      },
      headers: {
          'Content-Type': undefined
      }
    }).then(
      function (response){
        deferred.resolve(response.data);
        commonUIService.showNotifyMessage('Add a new boat successfully', 'success');
        console.log(response.data)
      },
      function(error) {
        commonUIService.showNotifyMessage('Add a new boat unsuccessfully');
      }
    ) 
    
    return deferred.promise;
  }

  boatCoreService.prototype.deleteBoat = function deleteBoat(boatId) {
    var deferred = $q.defer();
    var data={};
    var url = commonUIService.getUrl(commonUIService.URL.DELETE_BOAT, [boatId]);
    $http.delete(url, this.header).then(
      function (response){
        console.log('Boat deleted');
        deferred.resolve();
        commonUIService.showNotifyMessage('Delete this boat successfully', 'success');
      },
      function(error) {
        commonUIService.showNotifyMessage('Delete this boat unsuccessfully');
        deferred.reject('Cannot not delete this boat');
      }
    )  
    return deferred.promise;
  }

  boatCoreService.prototype.getGoods = function getGoods(boatId) {
    var deferred = $q.defer();
    var url = commonUIService.getUrl(commonUIService.URL.GET_GOODS, [boatId]);
    $http.get(url, this.header).then(
      function (response){
        deferred.resolve(response.data);
      },
      function (error){
        commonUIService.showNotifyMessage('Cannot get goods');
      }
    )  
    return deferred.promise;
  }

  boatCoreService.prototype.addGoods = function addGoods(goods) {
    var deferred = $q.defer();
    var url = commonUIService.URL.ADD_GOODS.baseUrl;
    var body = {
        "good" : {
          "name" : goods.name,
          "quantity" : goods.quantity,
          "boat_id" : this.boatId
        }
    };
    $http.post(url, body, this.header).then(
      function (response){
        deferred.resolve(response.data);
        commonUIService.showNotifyMessage('Add new goods successfully', 'success');
      },
      function (error){
        commonUIService.showNotifyMessage('Add new goods unsuccessfully');
      }
    )  
    return deferred.promise; 
  };

  boatCoreService.prototype.deleteGoods = function deleteGoods(goodsId) {
    var deferred = $q.defer();
    var url = commonUIService.getUrl(commonUIService.URL.MODIFY_GOODS, [goodsId]);
    $http.delete(url, this.header).then(
      function (response){
        commonUIService.showNotifyMessage('Delete goods successfully', 'success');
        deferred.resolve();
      },
      function (error){
        commonUIService.showNotifyMessage('Delete goods unsuccessfully');
      }
    )  
    return deferred.promise;
  };

  boatCoreService.prototype.updateGoods = function updateGoods(goods) {
    var deferred = $q.defer();
    var url = commonUIService.getUrl(commonUIService.URL.MODIFY_GOODS, [goods.id]);
    var body ={
        "good" : {
        "name" : goods.name,
        "quantity" : goods.quantity,
        "boat_id" : this.boatId
      }
    }
    $http.put(url, body, this.header).then(
      function (response){
        console.log(response);
        commonUIService.showNotifyMessage('Update goods successfully', 'success');
        deferred.resolve();
      },
      function (error){
        commonUIService.showNotifyMessage('Update goods unsuccessfully');
      }
    )  
    return deferred.promise;
  };

  return new boatCoreService($http, $q);
})

