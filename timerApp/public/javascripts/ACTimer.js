var CurrentTimer = new Timer(null);

angular.module('actimer', ['ngResource',"services"])
        .factory('Resource',["$resource", function($resource){
            return $resource("http://localhost:3000/timers/:id", {id:"@_id"}, null);
        }])
        .factory('ProjectsHelper', ['$http', function($http){
            return {
                
                GetProjects: function(){
                    return $http.get('/projects');
                },
                GetTasks: function(projectId){
                    return $http.get('/tasks/project/'+projectId);
                } 
            };
        }])
        .controller('ProjectsTasksController', ['$scope', 'ProjectsHelper', function($scope, ProjectsHelper){
           

            $scope.loadTasks = function(){
                ProjectsHelper.GetTasks($scope.selectedProject).success(function(data){
                    $scope.tasks = data;
                }).error(function(data, status){
                    $scope.tasks = [];
                });
            };
          
            $scope.loadProjects = function(){
                ProjectsHelper.GetProjects().success(function(data){
                    $scope.projects = data;
                }).error(function(data, status){
                    $scope.projects = [];
                });
            };

            $scope.changeTask = function() {
                CurrentTimer.properties.task = $scope.selectedTask;
            };



            $scope.loadProjects();
        }])
        .factory('CategoryHelper', ['$http', function($http){
            return $http.get('/category');
        }])
        .controller('CategoryController', ['$scope', 'CategoryHelper', function($scope, CategoryHelper){
            CategoryHelper.success(function(data){
                $scope.categories = data;
            }).error(function(data, status){
                $scope.categories = [];
            });

            $scope.changeCategory = function() {
                CurrentTimer.properties.category = $scope.selectedCategory;
            };
            
        }])
        .controller("TimerFormController", ['$scope', "$http", "Resource", function($scope, $http, Resource){

            function validate()
            {
                var numReg = /[0-9]/;
                return ($scope.description !== ""
                        && $scope.date !== null
                        && numReg.test($scope.hours)
                        && numReg.test($scope.minutes)
                        && numReg.test($scope.seconds)
                        && CurrentTimer.properties.task > 0
                        && CurrentTimer.properties.category > 0);
            }

            function convertTime()
            {
                return (($scope.hours * 3600) + ($scope.minutes * 60) + parseInt($scope.seconds));
            }

            $scope.submit = function(){

                var newTimer, time = convertTime();

                newTimer = {
                    description: $scope.description,
                    date: $scope.date,
                    elapsedTime: time,
                    billable: $scope.billable
                };

                jQuery.extend(CurrentTimer.properties, newTimer);

                if(validate())
                {
                    Resource.save(CurrentTimer.properties);
                }
                else
                {
                    console.log("Invalid Input");
                }
            };
        }])
        .controller("TimerListController", ['$scope', "Resource", function($scope, Resource){

            $scope.loadTimers = function(){
                $scope.timers = Resource.get();
            };



        }]);