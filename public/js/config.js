function configApp ($stateProvider, $urlRouterProvider){
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
        
}

var HttpInterceptorModule = angular.module('HttpInterceptorModule', [])
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
    
})
//register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', function ($q, $window, $log) { 
    var mainScope;

    function getMainScope () {
        if(!mainScope)
            mainScope = angular.element('#newWorkspace').scope();
        return mainScope;
    }

    function checkBackendGotError (response) {
        var message;

        try{            
            //for runtime error
            var iposResponse = getValueByPropertyName(response, 'ipos-response:response');
            if(iposResponse && iposResponse['@code'] === "500"){
                var cause = getValueByPropertyName(iposResponse, 'ipos-response:cause');                
                message = "There're errors with backend. Please contact admin!";
                getMainScope().showAlert(message, 'alert', 10000);
                $log.error("Error from backend. See response object below for more detail: ");
                $log.error(response);
            }
        }
        catch(e){
            $log.error(e);
        }
    }

    return {
        // optional method
        'request': function(config) {
            angular.element(document).find('#full-loading').css('display','show')
            return config || $q.when(config);
        },
        'requestError': function(rejection) {
            angular.element(document).find('#full-loading').css('display','none')
            commonUIService.showNotifyMessage("Bad Request");
            return $q.reject(rejection);
        },
        'response': function(response) {
            angular.element(document).find('#full-loading').css('display','none');
             return response || $q.when(response);
         },
         'responseError': function(rejection) {
            angular.element(document).find('#full-loading').css('display','none');
             return $q.reject(rejection);
         }
    };
});
