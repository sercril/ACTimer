var CurrentTimer = new Timer();

angular.module('actimer', ["services"])
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
        //.factory("Timer", ['$http', function($request){
        //
        //    return {
        //        Add: function(newTimer) {
        //            return $http.post(
        //                "http://localhost:3000/timers",
        //                newTimer
        //            );
        //        }
        //    };
        //}])
        .controller("TimerFormController", ['$scope',  "$http", function($scope, $http){




            function validate()
            {
                var numReg = /[0-9]/;
                return ($scope.description !== ""
                        && numReg.test($scope.hours)
                        && numReg.test($scope.minutes)
                        && numReg.test($scope.seconds));
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

                CurrentTimer.save();


                if(validate())
                {

                }
                else
                {
                    console.log("Invalid Input");
                }
            };

        }]);