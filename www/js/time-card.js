(function(){
    'use strict';

    angular.module('NaturalTime')
        .directive('timeCard', ['$rootScope', function($rootScope){
        return {

            restrict : 'C',
            scope : {'moment' : "="},
            templateUrl : "templates/time-card.html",
            link : function(scope, element, attrs) {

                scope.$watch('moment', function(nv){

                    if(nv){
                        scope.formattedTime = nv.format("h:mm a");    
                        scope.formattedDate = nv.format("dddd, MMMM Do YYYY");    

                    }
                })
                
                
            }



        }


    }]);
    

}());