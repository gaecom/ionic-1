




angular.module('directory.controllers', [])

    .controller('EmployeeIndexCtrl', function ($scope, EmployeeService) {

        var primus = Primus.connect("ws://54.213.134.12:8080");

        $scope.searchKey = "";
        $scope.points =[];
        var a,b;

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

                //console.log(data);
                var temp;

                if( $scope.points.length == 0 )
                {
                    $scope.points = JSON.parse(data).values;
                }
                else
                {
                    temp= JSON.parse(data).values;

                    for ( var i in temp)
                    {
                        for( var j in $scope.points)
                        {


                            a = temp[i].relationship_path;
                            b = $scope.points[j].relationship_path;

                            console.log("A " + a);

                            console.log("B " + b);

                            if( a[0] == b[0])
                            {
                                console.log("equal");
                                $scope.points[j].data[0] = temp[i].data[0]
                            }
                        }
                    }

                }


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
