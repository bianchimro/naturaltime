(function(){
    'use strict';

    angular.module('NaturalTime')
        .directive('locationCard', ['$rootScope', 'nominatimService', function($rootScope, nominatimService){
        return {

            restrict : 'C',
            scope : {'location' : "="},
            templateUrl : "templates/location-card.html",
            link : function(scope, element, attrs) {

                scope.displayName = null;
                scope.$watch('location', function(nv){
                    if(nv){
                        console.log("xxxx", nv)
                        nominatimService.searchCoords(nv.lat, nv.lon).then(function(data){
                            console.log("found!", data);
                            scope.displayName = data.display_name;
                            scope.address = data.address;
                        })
                    }

                }, true);
                
                
            }



        }


    }]);
    

}());