function ACTimer(props) {

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

ACTimer.prototype = {
    constructor: ACTimer
};


