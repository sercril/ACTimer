

angular.module('actimer', [])
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
            
        }])
        .factory("Timer", ['$request', function($request){

            return {
                Add: function(newTimer) {
                    return $request.post(
                        "http://localhost:3000/timers",
                        newTimer,
                        function(error, reponse, body){
                            if(error)
                            {
                                console.log(error);
                            }
                        }
                    );
                }
            };


        }])
        .controller("TimerFormController", ['$scope', "Timer", function($scope, Timer){

            function validate()
            {
                var numReg = /[0-9]/;
                return ($scope.description !== ""
                        && numReg.text($scope.hours)
                        && numReg.text($scope.minutes)
                        && numReg.text($scope.seconds));
            }

            $scope.submit = function(){

                var newTimer;

                if(validate())
                {
                    newTimer = {
                        description: $scope.
                    };

                    Timer.Add()
                }
                else
                {
                    console.log("Invalid Input");
                }
            };

        }]);