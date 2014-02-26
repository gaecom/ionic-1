/**
 * Created by meme on 2/25/14.
 */
var app = angular.module('todo', ['ionic']);

app.controller("TaskCtrl",function($scope, $ionicModal){

    var tasks = [
        {
            title:"Task 1"
        },
        {
            title:"Task 2"
        }];

    $scope.tasks = tasks;


    // Create and load the Modal
    $ionicModal.fromTemplateUrl('newTask.html', function(modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });


    $scope.newTask = function ()
    {
        $scope.taskModal.show();
    }
})
