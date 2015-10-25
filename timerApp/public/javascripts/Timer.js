function Timer(props) {

    this.properties = {
        elapsedTime: 0,
        billable: false,
        description: "",
        category: "",
        date: Date.now(),
        task: 0
    };


    if (typeof props !== "undefined")
    {
        jQuery.extend(this.properties, props);
    }
}

Timer.prototype = {

    constructor: Timer


};


