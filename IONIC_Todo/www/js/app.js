/**
 * Created by meme on 2/25/14.
 *
 *
 */

var sock = new SockJS('http://54.213.134.12:8088/alarms');

var app = angular.module('todo', ['ionic']);


app.factory("Projects", function () {
    return {
        all: function () {
            var localProjects = window.localStorage["projects"];
            if (localProjects) {
                return angular.fromJson(localProjects);
            }

            return [];
        },
        save: function (projects)
        {
            window.localStorage["projects"]= angular.toJson(projects);
        },
        newProject: function (projectName)
        {
            return {
                title:projectName,
                tasks: []
            }
        },
        getLastActiveIndex: function ()
        {
            return parseInt(window.localStorage["lastActiveIndex"]) || 0;
        },
        setLastActiveIndex: function (index)
        {
            window.localStorage["lastActiveIndex"] = index;
        }
    }
});

app.controller("TaskCtrl", function ($scope, $ionicModal, Projects,$timeout) {


    var alarmCount;
    $scope.inAlarm= false;
    $scope.connected = false;



    sock.onopen = function () {
        console.log("Connected...")
        $scope.connected = true;
        $scope.$apply();
    };
    sock.onmessage = function (e) {

        console.log("Got Message...")

        alarmCount  = parseInt(e.data);


        if( alarmCount > 0)
        {
            $scope.inAlarm = true;
            //alert("alarms");

        }
        else
        {
            $scope.inAlarm = false;
            //alert("no alarms");

        }
        $scope.$apply();

    };
    sock.onclose = function () {

        console.log("Lost Connection..")
        $scope.connected = false;
        $scope.$apply();
        setTimeout(reconnectSockjs, 2000);

    };


    var reconnectSockjs = function ()
    {
        console.log("Reconnecting..")
        sock = new SockJS('http://54.213.134.12:8088/alarms');
    }

    var createProject = function (projectTitle)
    {
         var project =  Projects.newProject(projectTitle);
         $scope.projects.push(project);
         Projects.save($scope.projects);
         $scope.selectProject(project, $scope.projects.length -1);
    }

    $scope.projects = Projects.all();
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];


    $scope.newProject = function (projectName)
    {
        var p = prompt("Create Project");

        if(p)
        {
            createProject(p);
        }
    }

    $scope.selectProject = function(p,index)
    {
        $scope.activeProject = p;
        Projects.setLastActiveIndex(index);
        $scope.sideMenuController.close();
    }


    var tasks = [
        {
            title: "Task 1"
        },
        {
            title: "Task 2"
        }
    ];

    $scope.tasks = tasks;


    // Create and load the Modal
    $ionicModal.fromTemplateUrl('newTask.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });


    $scope.newTask = function () {
        $scope.taskModal.show();
        $scope.inAlarm = true;
    };

    $scope.closeNewTask = function () {
        $scope.taskModal.hide();
    }

    $scope.toggleProjects = function() {
        $scope.sideMenuController.toggleLeft();
    };


    $scope.createTask = function (task) {

        if( !$scope.activeProject || !task)
        {
            return;
        }

        $scope.activeProject.tasks.push({
            title: task.title
        })

        $scope.taskModal.hide();
    }


    $timeout(function() {
        if($scope.projects.length == 0) {
            while(true) {
                var projectTitle = prompt('Your first project title:');
                if(projectTitle) {
                    createProject(projectTitle);
                    break;
                }
            }
        }
    });



})
