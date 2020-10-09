(function(){
    'use strict';

    angular.module('NaturalTime')
    .controller('AppCtrl', ['$scope', '$interval', 'geolocation', '$timeout', '$ionicScrollDelegate', function($scope, $interval, geolocation, $timeout, $ionicScrollDelegate) {


        $scope.currentMoment = null;
        $scope.currentDate = null;
        $scope.currentLocation = null;

        $scope.sunPosition = null;


        $scope.times = [];
        var calcs = [
            { label:'Sunrise', prop:'sunrise', desc: 'Top edge of the sun appears on the horizon'},
            { label: 'Sunrise end', prop: "sunriseEnd", desc:  "sunrise ends (bottom edge of the sun touches the horizon)"},
            { label: 'Golden hour end', prop:"goldenHourEnd", desc:   "morning golden hour (soft light, best time for photography) ends"},
            { label: 'Solar noon', prop:"solarNoon", desc:   "solar noon (sun is in the highest position)"},
            { label: 'Golden hour', prop:"goldenHour", desc:  "evening golden hour starts"},
            { label: 'Sunset starts', prop:"sunsetStart", desc: "sunset starts (bottom edge of the sun touches the horizon)"},
            { label: "Sunset", prop:"sunset", desc: "sunset (sun disappears below the horizon, evening civil twilight starts)"},
            { label: "Dusk", prop:"dusk", desc:  "dusk (evening nautical twilight starts)"},
            { label: "Nautical dusk", prop:"nauticalDusk" , desc:  "nautical dusk (evening astronomical twilight starts)"},
            { label: "Night", prop:"night", desc:  "night starts (dark enough for astronomical observations)"},
            { label: "Nadir", prop:"nadir", desc:  "nadir (darkest moment of the night, sun is in the lowest position)"},
            { label: "Night end", prop:"nightEnd", desc:  "night ends (morning astronomical twilight starts)"},
            { label: "Nautical Dawn", prop:"nauticalDawn", desc:  "nautical dawn (morning nautical twilight starts)"},
            { label: "Dawn", prop:"dawn", desc:  "Morning nautical twilight ends, morning civil twilight starts)"},


            { label: 'Blue hour', prop:"blueHour", desc:  "morning blue hour starts"},
            { label: 'Blue hour ends', prop:"blueHourEnd", desc:  "evening blue hour ends"},
        ]


        $scope.updateTimes = function(){
            console.log("updating times..")
            var times;

            if(!$scope.currentDay || !$scope.currentLocation){
                $scope.times = [];
                return;
            }

            $timeout(function(){
                var stimes = [];
                times = SunCalc.getTimes($scope.currentDate, $scope.currentLocation.lat, $scope.currentLocation.lon);
                _.each(calcs, function(item){
                    var val = times[item.prop];
                    // get position of the sun (azimuth and altitude) at today's sunrise
                    var sunrisePos = SunCalc.getPosition(val, $scope.currentLocation.lat, $scope.currentLocation.lon);
                    // get sunrise azimuth in degrees
                    var sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;
                    var sunriseAltitude = sunrisePos.altitude * 180 / Math.PI;
                    var mom = moment(val);
                    var o = { 
                        //moment : mom,
                        timeFormatted : mom.format("hh:mm a"), 
                        time:val, 
                        sunrisePos:sunrisePos, 
                        sunriseAzimuth:sunriseAzimuth,
                        sunriseAltitude : sunriseAltitude
                    };
                    o = angular.extend(o, item);
                    stimes.push(o);
                });
                stimes = _.sortBy(stimes, function(item){ return item.time})
                $scope.times = stimes;

                $scope.sunPosition = SunCalc.getPosition($scope.currentDate, $scope.currentLocation.lat, $scope.currentLocation.lon);
                $scope.moonPosition = SunCalc.getMoonPosition($scope.currentDate, $scope.currentLocation.lat, $scope.currentLocation.lon);
                $scope.moonIllumination = SunCalc.getMoonIllumination($scope.currentDate);
                
                
            });

        };

        $scope.$watch('currentDate', function(nv, ov){
            if(nv && nv != ov){
                $scope.updateTimes();    
            }
            
        }, true);

        $scope.$watch('currentLocation', function(nv){
            if(nv){
                $scope.updateTimes();
            }
        }, true);
        

        $scope.updateLocation = function(){
            geolocation.getLocation().then(function(data){
                $scope.currentLocation = {lat:data.coords.latitude, lon:data.coords.longitude};
            });
        };


        //init
        $scope.updateLocation();

        $interval(function(){
            var m = moment();
            $timeout(function(){
                $scope.currentMoment = m;
                $scope.currentDate = m.toDate();
                $scope.currentDay = {day:m.day(), month:m.month(), year:m.year()};
            });

        }, 1000);


        SunCalc.addTime("-4", 'blueHour', 'blueHourEnd') 


        $scope.currentPanel = 'watch';
        $scope.setPanel = function(p){
            $timeout(function(){
                $scope.currentPanel = p;
                $ionicScrollDelegate.scrollTop();
            })
        }



    }]);


})()