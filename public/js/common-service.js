var commonUIModule = angular.module('commonUIModule',['ngMaterial'])

.service('commonUIService',  function($mdToast, $animate, $mdDialog){
	
	function CommonUIService(){
		this.URL = {
	    	"GET_BOATS": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/boat/getall"
	    	},
	    	"ADD_BOAT": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/boat/createnew"
	    	},
	    	"DELETE_BOAT": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/boats/{0}.json",
	    		"params" : [ "boatId" ]
	    	},
	    	"GET_GOODS": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/boat/getgoods?boat_id={0}",
	    		"params" : ["boatId"]
	    	},
	    	"ADD_GOODS": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/goods.json"
	    	},
	    	"MODIFY_GOODS": {
	    		"baseUrl" : "https://novahub-interview-api.herokuapp.com/goods/{0}.json",
	    		"params" : [ "goodsId" ]
	    	}
	    };
	};

	CommonUIService.prototype.showNotifyMessage = function(message, status, timeout){
    	if(!timeout)
    		timeout = 4000;

		this.message = message;
		this.status = status;
    	$mdToast.show({
    		controller: 'MessageCtrl',
		    templateUrl: 'template/toast-message.html',
		    hideDelay: timeout,
		    position: 'bottom'
	    });
    };

    

    CommonUIService.prototype.getUrl = function(urlElement, arrayOfParams) {
    	var self = this;
		var baseUrl = urlElement.baseUrl;
		var i = 0;
		if (self.hasValue(baseUrl) && self.hasValue(arrayOfParams)) {
			return baseUrl.replace(/\{\d+\}/g, function(substr) {
				var param = arrayOfParams[i];
				if (self.hasValue(param)) {
					i += 1;
					return param;
				} else {
					return substr;
				}
			});
		}
		return urlElement;
	};

	CommonUIService.prototype.hasValue = function (variable){
		return (typeof variable !== 'undefined') && (variable !== null);
	};

    return new CommonUIService($mdToast, $animate, $mdDialog);
})

.controller('MessageCtrl', function($scope, $mdToast, commonUIService) {
	$scope.message = commonUIService.message;
	$scope.status = commonUIService.status;
	$scope.closeToast = function() {
	    $mdToast.hide();
	  };
})