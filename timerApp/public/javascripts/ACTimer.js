var CurrentTimer = new ActiveCollabTimer(null);

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
        .factory('TimerSubmit', ["$resource", function($resource){
            return $resource("http://actimer.dev/submit/", {}, null);
        }])
        .controller('TimerControlsController',['$scope', '$rootScope', 'Tasks', function($scope, $rootScope, Tasks){
            $scope.reloading = false;

            $scope.addTimer = function() {
                var addModal = {
                    title: 'Add Timer',
                    confirm: 'Add',
                    cancel: 'Cancel',
                    action: 'create',
                    type: 'form'
                };
                $rootScope.$emit('display-modal', addModal);
            };

            $scope.reloadTasks = function() {
                $scope.reloading = true;
                Tasks.get({id:'reload'}, function(result){
                    if('success' === result.result)
                        $scope.reloading = false;
                });
            };
        }])
        .controller('ProjectsTasksController', ['$scope', '$rootScope', 'ProjectTasks', 'Projects', function($scope, $rootScope, ProjectTasks, Projects){

            $scope.loadTasks = function(){
               loadTasks();
            };

            function loadTasks(taskId)
            {
                if('' === taskId)
                {
                    $scope.selectedTask = taskId;
                }
                else
                {
                    ProjectTasks.query({id:$scope.selectedProject},function(tasks){
                        $scope.tasks = tasks;

                        if(taskId !== 'undefined')
                        {
                            $scope.selectedTask = taskId;
                        }
                    });
                }
            }

            $scope.loadProjects = function(){
                Projects.query(function(projects){
                    $scope.projects = projects;
                });
            };

            $scope.changeTask = function() {
                CurrentTimer.properties.task = $scope.selectedTask;
            };

            $rootScope.$on('set-project-task', function(event, obj){
                $scope.selectedProject = obj.projectId;
                loadTasks(obj.taskId);
            });

            $scope.loadProjects();
        }])
        .controller('CategoryController', ['$scope', '$rootScope', 'Categories', function($scope, $rootScope, Categories){

            Categories.query(function(data){
                $scope.categories = data;
            });

            $scope.changeCategory = function() {
                CurrentTimer.properties.category = $scope.selectedCategory;
            };

            $rootScope.$on('set-category', function(event, obj){
               $scope.selectedCategory = obj.categoryId;
            });
            
        }])
        .controller("TimerFormController", ['$scope', '$rootScope', 'Tasks', "ACTimer", function($scope, $rootScope, Tasks, ACTimer){


            $scope.currentTimer = null;

            $rootScope.$on('edit-load', function(event, obj){
                var timeParts;
                $scope.currentTimer = CurrentTimer.properties;
                timeParts = moment().startOf('day')
                    .seconds(parseInt($scope.currentTimer.elapsedTime))
                    .format('H:mm:ss').split(':');
                $scope.currentTimer.hours = parseInt(timeParts[0]);
                $scope.currentTimer.minutes = parseInt(timeParts[1]);
                $scope.currentTimer.seconds = parseInt(timeParts[2]);

                $rootScope.$emit('set-category', {categoryId:$scope.currentTimer.category});

                Tasks.get({id:$scope.currentTimer.task},function(task){
                    $rootScope.$emit('set-project-task', {projectId:task.projectId, taskId:$scope.currentTimer.task});
                });
            });

            function validate()
            {
                var numReg = /[0-9]/;
                if(!numReg.test($scope.currentTimer.hours))
                {
                    $scope.currentTimer.hours = 0;
                }
                if(!numReg.test($scope.currentTimer.minutes))
                {
                    $scope.currentTimer.minutes = 0;
                }

                return ($scope.currentTimer.description !== ""
                        && $scope.currentTimer.timerDate !== null
                        && numReg.test($scope.currentTimer.seconds)
                        && CurrentTimer.properties.task > 0
                        && CurrentTimer.properties.category > 0);
            }

            function convertTime()
            {
                return (($scope.currentTimer.hours * 3600) + ($scope.currentTimer.minutes * 60) + parseInt($scope.currentTimer.seconds));
            }

            $scope.submit = function() {
                console.log(CurrentTimer);
                if(validate()) {
                    $scope.currentTimer.elapsedTime = convertTime();
                    $scope.currentTimer.date = new Date($scope.currentTimer.date);
                    jQuery.extend(CurrentTimer.properties, $scope.currentTimer);


                    if (0 === CurrentTimer.properties._id)
                    {
                        CurrentTimer.properties._id = undefined;
                        ACTimer.save(CurrentTimer.properties);
                    }
                    else
                    {
                        ACTimer.update( {id:CurrentTimer.properties._id}, CurrentTimer.properties);
                    }

                    $rootScope.$emit('update-list', {}  );
                }
                else
                {
                    console.log("Invalid Input");
                }
            };

            $rootScope.$on('submit-timer-form', function(event, obj){
                $scope.submit();
            });

            $rootScope.$on('reset-currentTimer', function(event, obj){
                $scope.currentTimer = null;
                $rootScope.$emit('set-category', {categoryId:''});
                $rootScope.$emit('set-project-task', {projectId:'', taskId:''});
            });

        }])
        .controller("TimerListController", ['$scope', '$rootScope', '$interval', "ACTimer", "Tasks", "Categories", "TimerSubmit", function($scope, $rootScope, $interval, ACTimer, Tasks, Categories, TimerSubmit){


            function parseTimer(timeString)
            {
                timeString = moment().startOf('day')
                    .seconds(parseInt(timeString))
                    .format('H:mm:ss');

                return timeString;
            }

            function incrementTimers()
            {
                $scope.actimers.forEach(function(t){
                    if(true === t.active)
                    {
                        t.elapsedTime += 1;
                        t.elapsedTimeReadable = parseTimer(t.elapsedTime);
                        ACTimer.update( {id:t._id}, t)
                    }
                });
            }

            $scope.loadTimers = function(){

                function formatTimer(timerToFormat)
                {
                    //Get Category by ID
                    Categories.get({id:timerToFormat.category},function(category){
                        timerToFormat.categoryName = category.categoryName;
                    });
                    //Get Task by ID
                    Tasks.get({id:timerToFormat.task},function(task){
                        timerToFormat.taskName = task.taskName;
                    });
                    //Change Date into m/d/Y format
                    timerToFormat.date = moment(timerToFormat.date).format('MM/DD/YYYY');

                    //Parse Time
                    timerToFormat.elapsedTimeReadable = parseTimer(timerToFormat.elapsedTime);
                    //Change billable to say Not billable/billable
                    timerToFormat.billableReadable = (timerToFormat.billable) ? "Billable":"Not Billable";

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

            $scope.submitTimer = function(timer) {
                console.log(timer);


                var valueParts = moment().startOf('day')
                    .seconds(parseInt(timer.elapsedTime))
                    .format('H:mm:ss');

                valueParts = valueParts.split(':');

                var roundedSecs = (parseInt(valueParts[2]) >= 30 ? 1:0);
                var roundedMins = Math.ceil(parseInt((valueParts[1])+roundedSecs)/15)/4;

                var finalVal = parseInt(valueParts[0]) + roundedMins;

                Tasks.get({id:timer.task}, function(task){
                    var timeRecord = {
                        job_type_id: parseInt(timer.category),
                        summary: timer.description,
                        record_date: moment(timer.date).format('YYYY-MM-DD'),
                        billable_status: (timer.billable ? 1:0),
                        value: finalVal,
                        task_id: timer.task,
                        project_id: task.projectId
                    };

                    TimerSubmit.save(timeRecord);

                });


            };


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
                        $rootScope.$emit('submit-timer-form', {});
                        break;
                    case 'update':
                        $rootScope.$emit('submit-timer-form', {});
                        break;
                    case 'delete':
                        ACTimer.delete({id: $scope.modal.timer._id}, function(){});
                        break;
                }
                $rootScope.$emit('update-list', {});
                $scope.close();
            };

            $rootScope.$on('display-modal', function(event, obj){
                $scope.modal = obj;
                if('message' === $scope.modal.type)
                {
                    $scope.message.active = true;
                }
                else if('form' === $scope.modal.type)
                {
                    if('update' === $scope.modal.action)
                    {
                        jQuery.extend(CurrentTimer.properties, $scope.modal.timer);
                        $rootScope.$emit('edit-load', {});
                    }
                    else if('create' === $scope.modal.action)
                    {
                        CurrentTimer = new ActiveCollabTimer(null);
                        $rootScope.$emit('reset-currentTimer', {});
                    }
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
