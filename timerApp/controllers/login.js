function loginController($location, authentication)
{
    var vm = this;

    vm.credentials = {
        email: "",
        password: ""
    };

    vm.submit = function(){
        authentication
            .login(vm.credentials)
            .error(function(error){
                alert(error);
            })
            .then(function(){
                $location.path('profile');
            });
    };
}