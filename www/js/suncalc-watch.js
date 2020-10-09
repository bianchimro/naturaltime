(function(){
    'use strict';

    angular.module('NaturalTime')
        .directive('suncalcWatch', ['$timeout', function($timeout){
        return {

            restrict : 'C',
            templateUrl : "templates/suncalc-watch.html"
        }

    }]);
    

}());