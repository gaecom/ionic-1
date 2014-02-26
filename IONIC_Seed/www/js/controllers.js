var sock = new SockJS('http://54.213.134.12:8088/alarms');


angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {     // controllerPage
        //var tabsController = $scope.tabsController; // undefined
        //console.log(tabsController);

    })

// A simple controller that fetches a list of data from a service
    .controller('PetIndexCtrl', function ($scope, PetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.pets = PetService.all();
    })


// A simple controller that shows a tapped item's data
    .controller('PetDetailCtrl', function ($scope, $stateParams, PetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.pet = PetService.get($stateParams.petId);
    })

    // A simple controller that shows a tapped item's data
    .controller('NavCtrl', function ($scope, $stateParams, PetService) {
        // "Pets" is a service returning mock data (services.js)

        var that = this;
        $scope.isAlarm = false;
        var ctrls = $scope.controllers;

        $scope.$on("tab.shown", function () {

            //$scope.isAlarm = true;

           // $state.go('tab.adopt')
        })

        sock.onopen = function () {
            alert('Connected.');
        };
        sock.onmessage = function (e) {
            alert(e.data);
        };
        sock.onclose = function () {
            alert('Closing Connection.');
        };

    });
