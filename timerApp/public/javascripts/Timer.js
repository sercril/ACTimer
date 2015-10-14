var Timer = (function () {
    function Timer() {
        this.billable = false;
        this.task = null;
    }


    Timer.prototype.get = function () {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    };

    Timer.prototype.put = function (todos) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    };


    return Timer;
})();