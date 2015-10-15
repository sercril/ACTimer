function Timer(request, props) {

    this.properties = {
        elapsedTime: 0,
        billable: false,
        description: "",
        category: "",
        date: Date.now(),
        task: 0
    };

    this.request = request;

    if (typeof props !== "undefined")
    {
        jQuery.extend(this.properties, props);
    }
}

Timer.prototype = {

    constructor: Timer,

    load: function(timerId){
        this.request({
            method: "post",
            url:"http://localhost:3000/timers",
            data: this.properties
        })
        .success(function(data){
            console.log("Timer Added!");
        })
        .error(function(data, status){
            console.log("Timer Failed!");
        });
    },

    save: function()
    {
        this.request({
            method: "post",
            url:"http://localhost:3000/timers",
            data: this.properties
        })
        .success(function(data){
            console.log("Timer Added!");
        })
        .error(function(data, status){
            console.log("Timer Failed!");
        });
    }
};


