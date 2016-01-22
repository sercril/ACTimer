var CurrentTimer = new ACTimer(null);

angular.module('actimer', ['ngResource',"services"])
        .factory('ACTimer',["$resource", function($resource){
            return $resource("http://actimer.dev/timers/:id", null, {'update': {method:'PUT'}});
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
        .controller("TimerFormController", ['$scope', '$rootScope',  "ACTimer", function($scope, $rootScope,  ACTimer){



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

                if(validate()) {
                    time = convertTime();
                    newTimer = {
                        description: $scope.description,
                        date: $scope.timerDate,
                        elapsedTime: time,
                        billable: $scope.billable
                    };

                    jQuery.extend(CurrentTimer.properties, newTimer);

                    if (0 === CurrentTimer.properties._id)
                    {
                        ACTimer.save(CurrentTimer.properties);
                    }
                    else
                    {
                        ACTimer.update(CurrentTimer.properties);
                    }


                    clearInput();
                    $rootScope.$emit('update-list', {}  );
                }
                else
                {
                    console.log("Invalid Input");
                }
            };
        }])
        .controller("TimerListController", ['$scope', '$rootScope', '$interval', "ACTimer", "Tasks", "Categories", function($scope, $rootScope, $interval, ACTimer, Tasks, Categories){


            function parseTimer(timeString)
            {
                timeString = moment().startOf('day')
                    .seconds(parseInt(timeString))
                    .format('H:mm:ss');

                return timeString;
            }

            $scope.loadTimers = function(){

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
                    timerToFormat.date = moment(timerToFormat.date).format('MM/DD/YYYY');

                    //Parse Time
                    timerToFormat.totalSeconds = timerToFormat.elapsedTime;
                    timerToFormat.elapsedTime = parseTimer(timerToFormat.totalSeconds);
                    //Change billable to say Not billable/billable
                    timerToFormat.billable = (timerToFormat.billable) ? "Billable":"Not Billable";

                    timerToFormat.active = false;

                    return timerToFormat;
                }

                ACTimer.query(function(actimers){
                    actimers.forEach(function(t){
                        t = formatTimer(t);
                    });
                    $scope.actimers = actimers;
                });

            };

            function incrementTimers()
            {
                $scope.actimers.forEach(function(t){
                    if(true === t.active)
                    {
                        t.totalSeconds += 1;
                        t.elapsedTime = parseTimer(t.totalSeconds);
                    }
                });
            }

            $scope.startTimer = function(timer) {
                timer.active = true;
            };

            $scope.stopTimer = function(timer) {
                timer.active = false;
            };


            $scope.toggleTimer = function(timer) {
                if(true === timer.active)
                {
                    $rootScope.$emit('stop-timer', timer);
                }
                else if(false === timer.active)
                {
                    $rootScope.$emit('start-timer', timer);
                }
            };

            $scope.editTimer = function(timer) {
                var editModal = {
                    title: 'Edit Timer',
                    confirm: 'Save',
                    cancel: 'Cancel',
                    action: 'update',
                    type: 'form',
                    timer: timer
                };
                $rootScope.$emit('display-modal', editModal);
            };

            $scope.removeTimer = function(timer){
                var delModal = {
                    title: "Delete Timer",
                    message: "Are you sure you want to delete "+timer.description,
                    confirm: "Delete",
                    cancel: "Cancel",
                    action: 'delete',
                    timer: timer,
                    type: 'message'
                };
                $rootScope.$emit('display-modal', delModal);
            };

            $interval(incrementTimers, 1000);


            $rootScope.$on('update-list', function(event, obj){
                $scope.loadTimers();
            });

            $rootScope.$on('start-timer', function(event, obj){
                $scope.startTimer(obj);
            });

            $rootScope.$on('stop-timer', function(event, obj){
                $scope.stopTimer(obj);
            });

            $scope.loadTimers();

        }])
        .controller("ModalController", ['$scope', '$rootScope', 'ACTimer', function($scope, $rootScope, ACTimer){


            $scope.message = { active : false };
            $scope.form = { active : false };

            $scope.confirm = function () {
                switch ($scope.modal.action)
                {
                    case 'create':
                        break;
                    case 'update':
                        break;
                    case 'delete':
                        ACTimer.delete({id: $scope.modal.timer._id}, function(){});
                        break;
                }


                $rootScope.$emit('update-list', {});
            };

            $rootScope.$on('display-modal', function(event, obj){
                $scope.modal = obj;
                if('message' === $scope.modal.type)
                {
                    $scope.message.active = true;
                }
                else if('form' === $scope.modal.type)
                {
                    $scope.form.active = true;
                }

            });

            $scope.close = function(){
                if('message' === $scope.modal.type)
                {
                    $scope.message.active = false;
                }
                else if('form' === $scope.modal.type)
                {
                    $scope.form.active = false;
                }
            };
        }]);
