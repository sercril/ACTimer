var CurrentTimer = new Timer(null);

angular.module('actimer', ['ngResource',"services"])
        .factory('Timer',["$resource", function($resource){
            return $resource("http://localhost:3000/timers/:id", {}, null);
        }])
        .factory('Projects',["$resource", function($resource){
            return $resource("http://localhost:3000/projects", {}, null);
        }])
        .factory('Tasks',["$resource", function($resource){
            return $resource("http://localhost:3000/tasks/:id", {}, null);
        }])
        .factory('ProjectTasks',["$resource", function($resource){
            return $resource("http://localhost:3000/tasks/project/:id", {}, null);
        }])
        .factory('Categories',["$resource", function($resource){
            return $resource("http://localhost:3000/category/:id", {}, null);
        }])
        .controller('ProjectsTasksController', ['$scope', 'ProjectTasks', 'Projects', function($scope, ProjectTasks, Projects){

            $scope.loadTasks = function(){
                ProjectTasks.query({id:$scope.selectedProject},function(projects){
                    $scope.tasks = projects;
                });
            };

            $scope.loadProjects = function(){
                Projects.query(function(projects){
                    $scope.projects = projects;
                });
            };

            $scope.changeTask = function() {
                CurrentTimer.properties.task = $scope.selectedTask;
            };



            $scope.loadProjects();
        }])
        .controller('CategoryController', ['$scope', 'Categories', function($scope, Categories){

            Categories.query(function(data){
                $scope.categories = data;
            });

            $scope.changeCategory = function() {
                CurrentTimer.properties.category = $scope.selectedCategory;
            };
            
        }])
        .controller("TimerFormController", ['$scope', "Timer", function($scope, Timer){

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
                    Timer.save(CurrentTimer.properties);
                }
                else
                {
                    console.log("Invalid Input");
                }
            };
        }])
        .controller("TimerListController", ['$scope', "Timer", "Tasks", "Categories", function($scope, Timer, Tasks, Categories){

            $scope.loadTimers = function(){


                Timer.query(function(timers){
                    $scope.timers = timers;
                });

            };

            function formatTimer(timerToFormat)
            {
                //Get Category by ID
                //Get Task by ID
                //Change Date into m/d/Y format
                //Change billable to say Not billable/billable
            }

            $scope.loadTimers();

        }]);