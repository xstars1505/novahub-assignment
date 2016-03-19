var boatApp = angular.module('boatApp', ['ui.router', 'ngMaterial', 'ngFileUpload', 'boatModule', 'HttpInterceptorModule', 'commonUIModule'])

boatApp.config(configApp);

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

boatApp.controller('boatList', boatListCtrl);
boatApp.controller('goodsList', goodsListCtrl);
