function ActiveCollabTimer(props) {

    this.properties = {
        _id: 0,
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

ActiveCollabTimer.prototype = {
    constructor: ActiveCollabTimer
};



