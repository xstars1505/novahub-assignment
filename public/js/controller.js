function boatListCtrl ($scope, $state, $http, boatCoreService, $rootScope){
  
  $scope.getBoatList = function getBoatList(){
    boatCoreService.getAll().then(function(response){
      $scope.boatList = response;
    });
  }
  $scope.getBoatList();

  $scope.addBoat = function (boatName, file){
    boatCoreService.addBoat(boatName, file).then(function(response){
      $scope.getBoatList();
    })
  };

  $scope.deleteBoat = function (boatId){
    boatCoreService.deleteBoat(boatId).then(function(response){
      $scope.getBoatList();
    })
  };

  $scope.getBoatDetail = function getBoatDetail(boatId){
    $scope.goToState('boatDetail', {'boatId': boatId})
  };
  
  $scope.goToState = function goToState(stateName, params, option) {        
    return $state.go(stateName, params, option);
  };  
}  
  
function goodsListCtrl ($scope, $state, $http, boatCoreService, $stateParams) {

  boatCoreService.boatId = $state.params.boatId;
  $scope.errorMessage = "";
  $scope.sucessMessage = "";

  var getGoodsList = function(){
    boatCoreService.getGoods(boatCoreService.boatId).then(function(response){
      $scope.goodsList = response;
    })
  }
  getGoodsList();

  $scope.addGoods = function addGoods(goods){
    boatCoreService.addGoods(goods).then(function(response){
      getGoodsList();
    })
  };

  $scope.deleteGoods = function (goodsId){
    boatCoreService.deleteGoods(goodsId).then(function(response){
      getGoodsList();
      commonUIService.showNotifyMessage('Delete goods successfully', 'success');
    })
  };
  
  $scope.isEdit = true;

  $scope.editGoods = function (goodsId){
    $scope.isEdit = angular.copy(!$scope.isEdit);
  };

  $scope.updateGoods = function (goods){
    $scope.isEdit = angular.copy(!$scope.isEdit);
    boatCoreService.updateGoods(goods).then(function(response){
      getGoodsList();
    })
  };
}