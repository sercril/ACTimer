

angular.module('actimer', [])
       //.factory('Projects', ['$http', function($http){
       //     return $http.get('/projects');
       // }])
       // .factory('Tasks', ['$http', function($http){
       //     return $http.get('/tasks');
       // }])
        .controller('ProjectsTasksController', ['$scope', function($scope){
            $scope.loadTasks = function(){
                $http.get('/projects/'+$scope.selectedProject.projectId).success(function(data){
                    $scope.tasks = data;
                }).error(function(data, status){
                    $scope.tasks = [];
                });
            };

            $scope.loadProjects = function(){
                $http.get('/projects').success(function(data){
                    $scope.projects = data;
                }).error(function(data, status){
                    $scope.projects = [];
                });

                $scope.selectedProject = $scope.projects[0].projectId;
                $scope.loadTasks();
            };

            $scope.loadProjects();
        }]);