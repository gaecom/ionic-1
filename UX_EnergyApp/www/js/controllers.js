




angular.module('directory.controllers', [])

    .controller('EmployeeIndexCtrl', function ($scope, EmployeeService) {

        var primus = Primus.connect("ws://54.213.134.12:8080");

        $scope.searchKey = "";

        $scope.clearSearch = function () {
            $scope.searchKey = "";
            findAllEmployees();
        }

        $scope.search = function () {
            EmployeeService.findByName($scope.searchKey).then(function (employees) {
                $scope.employees = employees;
            });
        }

        var findAllEmployees = function() {
            EmployeeService.findAll().then(function (employees) {
                $scope.employees = employees;
            });
        }


        primus.on("open", function(){

            primus.on("newAlarms", function(data){

                console.log(data);
                $scope.alarms = JSON.parse(data).count + " Alarm(s)"
                $scope.$digest();

            });

            primus.on("newData", function(data){

                console.log(data);

                $scope.points = [];

                $scope.points = JSON.parse(data).values;



                $scope.$digest();
            })

        });

        //findAllEmployees();

    })

    .controller('EmployeeDetailCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findById($stateParams.employeeId).then(function(employee) {
            $scope.employee = employee;
        });
    })

    .controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function(employees) {
            $scope.employees = employees;
        });
    });