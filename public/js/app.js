var boatApp = angular.module('boatApp', ['ui.router'])

boatApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/index');
    
    $stateProvider
        
        // HOME STATES: List of boats ========================================
        .state('boatList', {
            url: '/index',
            controller:'boatList',
            templateUrl: 'boat-list.html'
        })
        
        // List of boat's goods =================================
        .state('boatDetail', {
            url: '/boatDetail',
            templateUrl: 'boat-detail.html',
            controller:'goodsList',
            params:{
              boatId: ''
            }
        });
        
})

boatApp.directive('file', function () {
    return {
        scope: {
            file: '='
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
                scope.$apply();
            });
        }
    };
});

boatApp.service('boatService', function($http, $q){
  var header = { 'Content-Type' : 'application/json' };
  this.boatId = '',

  // handle boat
  this.getAll = function() {
    var deferred = $q.defer();
    var body={};
    var url = 'https://novahub-interview-api.herokuapp.com/boat/getall';
    $http.get(url, header).then(function (response){
      deferred.resolve(response.data);
    })  
    return deferred.promise;
  };

  function getFileReader(file) {
     var self = this;
     var deferred = $q.defer();                                         
     var reader = new FileReader();       
     reader.onload = (function (file) {
        return function (e) {               
           var f = angular.copy(file);
           f.data = e.target.result;
           f.name = file.name;
           
           deferred.resolve(f);
        };
     })(file);    
     reader.readAsBinaryString(file);                
     return deferred.promise;           
   };

  this.addBoat = function(boatName, file) {
    var deferred = $q.defer();
    var reader = new FileReader();
    var config = { 'Content-Type' : undefined };
    getFileReader(file).then(function(binary){
      var body={
        "name" : boatName,
        "image" : file
      };
      var url = 'https://novahub-interview-api.herokuapp.com/boat/createnew';
      $http.post(url, body, config).then(function (response){
        deferred.resolve();
        console.log('Add sucess')
      }) 
    });
    
    return deferred.promise;
  };

  this.deleteBoat = function(boatId) {
    var deferred = $q.defer();
    var data={};
    var url = 'https://novahub-interview-api.herokuapp.com/boats/' + boatId + '.json';
    $http.delete(url, header).then(function (response){
      console.log(response);
      deferred.resolve();
    })  
    return deferred.promise;
  };

  //Handle goods
  this.getGoods = function(boatId) {
    var deferred = $q.defer();
    var url = 'https://novahub-interview-api.herokuapp.com/boat/getgoods?boat_id=' + boatId;
    $http.get(url, header).then(function (response){
      deferred.resolve(response.data);
    })  
    return deferred.promise;
  };

  this.addGoods = function(goods) {
    var deferred = $q.defer();
    var url = 'https://novahub-interview-api.herokuapp.com/goods.json';
    var body = {
        "good" : {
          "name" : goods.name,
          "quantity" : goods.quantity,
          "boat_id" : this.boatId
        }
    };
    $http.post(url, body, header).then(function (response){
      deferred.resolve(response.data);
    })  
    return deferred.promise; 
  };

  this.deleteGoods = function(goodsId) {
    var deferred = $q.defer();
    var url = 'https://novahub-interview-api.herokuapp.com/goods/' + goodsId + '.json';
    $http.delete(url, header).then(function (response){
      console.log(response);
      deferred.resolve();
    })  
    return deferred.promise;
  };

  this.updateGoods = function(goods) {
    var deferred = $q.defer();
    var url = 'https://novahub-interview-api.herokuapp.com/goods/' + goods.id + '.json';
    var body ={
        "good" : {
        "name" : goods.name,
        "quantity" : goods.quantity,
        "boat_id" : this.boatId
      }
    }
    $http.put(url, body, header).then(function (response){
      console.log(response);
      deferred.resolve();
    })  
    return deferred.promise;
  };
})


boatApp.controller('boatList', function($scope, $state, $http, boatService) {
  
  var getBoatList = function(){
    boatService.getAll().then(function(response){
      $scope.boatList = response;
    });
  }
  getBoatList();

  $scope.addBoat = function (boatName, file){
    boatService.addBoat(boatName, file).then(function(response){
      getBoatList();
    })
  };

  $scope.deleteBoat = function (boatId){
    boatService.deleteBoat(boatId).then(function(response){
      getBoatList();
    })
  };

  $scope.getBoatDetail = function getBoatDetail(boatId){
    $scope.goToState('boatDetail', {'boatId': boatId})
  };
  
  $scope.goToState = function goToState(stateName, params, option) {        
    return $state.go(stateName, params, option);
  };
})


boatApp.controller('goodsList', function($scope, $state, $http, boatService, $stateParams) {

  boatService.boatId = $state.params.boatId;
  
  var getGoodsList = function(){
    boatService.getGoods(boatService.boatId).then(function(response){
      $scope.goodsList = response;
    });
  }
  getGoodsList();

  $scope.addGoods = function addGoods(goods){
    boatService.addGoods(goods).then(function(response){
      getGoodsList();
    })
  };

  $scope.deleteGoods = function (goodsId){
    boatService.deleteGoods(goodsId).then(function(response){
      getGoodsList();
    })
  };
  
  $scope.isEdit = true;

  $scope.editGoods = function (goodsId){
    $scope.isEdit = angular.copy(!$scope.isEdit);
  };

  $scope.updateGoods = function (goods){
    $scope.isEdit = angular.copy(!$scope.isEdit);
    boatService.updateGoods(goods).then(function(response){
      getGoodsList();
    })
  };

})