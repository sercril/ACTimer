

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
            
            
        }]);