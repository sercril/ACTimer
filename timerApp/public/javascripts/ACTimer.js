

angular.module('actimer', ["services"])
       .factory('Projects', ['$http', function($http){
            return $http.get('/projects');
        }])
        .factory('Tasks', ['$http', function($http){
            return $http.get('/tasks');
        }])
        .controller('ProjectsTasksController', ['$scope', 'Projects', , function($scope, $http){
            GetProjects = function() {
                return $http.get('/projects');
            };

            GetTasks = function(projId) {
                return $http.get('/tasks/project/'+projId);
            };

            $scope.loadTasks = function(){
                $http.get('/tasks/project/'+$scope.selectedProject).success(function(data){
                    $scope.tasks = data;
                }).error(function(data, status){
                    $scope.tasks = [];
                });
            };
            $scope.loadProjects = function(){
                var projects = GetProjects();
                projects.success(function(data){
                    $scope.projects = data;
                }).error(function(data, status){
                    $scope.projects = 'error';
                });
                console.log($scope.projects);
                $scope.selectedProject = $scope.projects[0].projectId;
                $scope.loadTasks();
            };




            $scope.loadProjects();
        }]);