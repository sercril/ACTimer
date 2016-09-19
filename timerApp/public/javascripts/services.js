angular.module('services', [])
    .service('ActiveCollabTimer', [ActiveCollabTimer]);


angular
    .module('actimer')
    .service('authentication', authentication);


authentication.$inject = ['$http', '$window'];

function authentication($http, $window)
{
    var saveToken = function(token) {
        $window.sessionStorage['authToken'] = token;
    };

    var getToken = function(){
        return $window.sessionStorage['authToken'];
    };

    logout = function() {
        $window.sessionStorage.removeItem('authToken');
    };

    extractPayload = function (token) {
        var p = token.split('.')[1];
        p = $window.atob(p);
        return JSON.parse(p);
    };

    isLoggedIn = function() {
        var token = getToken();
        var payload;

        if(token)
        {
            payload = extractPayload(token);
            return ((payload.exp) > (Date.now() / 1000));
        }
        else
        {
            return false;
        }
    };

    var currentUser = function(){
        if(isLoggedIn())
        {
            var token = getToken();
            var payload = extractPayload(token);

            return {
                email : payload.email,
                systems : payload.systems
            }
        }
    };

    register = function(user) {
        return $http.post('/register', user).success(function(data){
            saveToken(data.token);
        });
    };

    login = function(user) {
        return $http.post('/login', user).success(function(data){
            saveToken(data.token);
        });
    };

    return {
        saveToken : saveToken,
        getToken : getToken,
        logout : logout,
        isLoggedIn : isLoggedIn
    };
}

function Authorization($http, authentication)
{
    var getProfile = function() {
        return $http.get('/profile', {
            headers: {
                Authorization: 'Bearer '+authentication.getToken()
            }
        });
    };

    return {
        getProfile : getProfile
    };
}