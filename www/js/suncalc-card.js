(function(){
    'use strict';

    angular.module('NaturalTime')
        .directive('suncalcCard', ['$timeout', function($timeout){
        return {

            restrict : 'C',
            scope : {'day' : "=", 'location':"=", times:"="},
            templateUrl : "templates/suncalc-card.html",
            link : function(scope, element, attrs) {

                
                
            }



        }


    }]);
    

}());