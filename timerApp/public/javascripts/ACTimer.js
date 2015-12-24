var CurrentTimer = new Timer(null);

angular.module('actimer', ['ngResource',"services"])
        .factory('Timer',["$resource", function($resource){
            return $resource("http://actimer.dev/timers/:id", {}, null);
        }])
        .factory('Projects',["$resource", function($resource){
            return $resource("http://actimer.dev/projects", {}, null);
        }])
        .factory('Tasks',["$resource", function($resource){
            return $resource("http://actimer.dev/tasks/:id", {}, null);
        }])
        .factory('ProjectTasks',["$resource", function($resource){
            return $resource("http://actimer.dev/tasks/project/:id", {}, null);
        }])
        .factory('Categories',["$resource", function($resource){
            return $resource("http://actimer.dev/category/:id", {}, null);
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
        .controller("TimerFormController", ['$scope', '$rootScope',  "Timer", function($scope, $rootScope,  Timer){


            $scope.parent = {timerDate:''};
            function validate()
            {
                var numReg = /[0-9]/;
                if(!numReg.test($scope.hours))
                {
                    $scope.hours = 0;
                }
                if(!numReg.test($scope.minutes))
                {
                    $scope.minutes = 0;
                }

                return ($scope.description !== ""
                        && $scope.timerDate !== null
                        && numReg.test($scope.seconds)
                        && CurrentTimer.properties.task > 0
                        && CurrentTimer.properties.category > 0);
            }

            function clearInput()
            {
                $scope.hours = "";
                $scope.minutes = "";
                $scope.seconds = "";
                $scope.description = "";
            }

            function convertTime()
            {
                return (($scope.hours * 3600) + ($scope.minutes * 60) + parseInt($scope.seconds));
            }

            $scope.submit = function(){

                var newTimer, time = convertTime();

                newTimer = {
                    description: $scope.description,
                    date: $scope.parent.timerDate,
                    elapsedTime: time,
                    billable: $scope.billable
                };
                console.log(newTimer);

                jQuery.extend(CurrentTimer.properties, newTimer);

                return;

                if(validate())
                {
                    time = convertTime();
                    newTimer = {
                        description: $scope.description,
                        date: $scope.timerDate,
                        elapsedTime: time,
                        billable: $scope.billable
                    };

                    jQuery.extend(CurrentTimer.properties, newTimer);
                    console.log($scope.timerDate);
                    Timer.save(CurrentTimer.properties);
                    clearInput();
                    $rootScope.$emit('update-list', {}  );
                }
                else
                {
                    console.log("Invalid Input");
                }
            };
        }])
        .controller("TimerListController", ['$scope', '$rootScope', "Timer", "Tasks", "Categories", function($scope, $rootScope, Timer, Tasks, Categories){

            $scope.loadTimers = function(){

                function parseTimer(timeString)
                {


                    return timeString;
                }

                function formatTimer(timerToFormat)
                {
                    //Get Category by ID
                    Categories.get({id:timerToFormat.category},function(category){
                        timerToFormat.categoryId = timerToFormat.category;
                        timerToFormat.category = category.categoryName;
                    });
                    //Get Task by ID
                    Tasks.get({id:timerToFormat.task},function(task){
                        timerToFormat.taskId = timerToFormat.task;
                        timerToFormat.task = task.taskName;
                    });
                    //Change Date into m/d/Y format


                    //Parse Time
                    timerToFormat.totalSeconds = timerToFormat.elapsedTime;
                    timerToFormat.elapsedTime = parseTimer(timerToFormat.elapsedTime);
                    //Change billable to say Not billable/billable
                    timerToFormat.billable = (timerToFormat.billable) ? "Billable":"Not Billable";

                    return timerToFormat;
                }

                Timer.query(function(timers){
                    timers.forEach(function(timer){
                        timer = formatTimer(timer);
                    });

                    $scope.timers = timers;
                });

            };

            $rootScope.$on('update-list', function(event, obj){
                $scope.loadTimers();
            });

            $scope.loadTimers();

        }]);