(function(){
    'use strict';

    var mod = angular.module('NaturalTime');
    mod.factory('nominatimService', [ '$q', '$http', function($q, $http){
        var svc = {};

        svc.searchAddress = function(address){
            var o = $q.defer();
            console.log("searching address", address);
            $http({
                method : 'get',
                url : 'http://nominatim.openstreetmap.org/search',
                params : {
                    format : 'json',
                    q : address

                }
            }).then(function(response){
                o.resolve(response.data);
            });

            return o.promise;
        };


        svc.searchCoords = function(lat,lon){
            var o = $q.defer();
            console.log("searching coords", lat,lon);
            $http({
                method : 'get',
                url : 'http://nominatim.openstreetmap.org/reverse',
                params : {
                    format : 'json',
                    lat : lat,
                    lon : lon,
                    addressdetails : 1
                }
            }).then(function(response){
                o.resolve(response.data);
            });

            return o.promise;
        }


        return svc;
    }]);
    

}());