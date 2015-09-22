var ProjectList = React.createClass({

    getInitialState: function (){
      return {data:[]};
    },
    loadTasksFromServer: function() {
        $.ajax({
            url: this.props.url,
            async:true,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount : function(){
        this.loadTasksFromServer();
        //setInterval(this.loadTasksFromServer(), this.props.pollInterval);
    },
    render: function () {
        var taskNodes = this.state.data.map(function (task) {
            return (
                <Project data={task} />
            );
        });
        return(
            <div className="dropdown column half">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Project
                    <span class="caret"></span>
                </button>
                <ul className="dropdown-menu"  aria-labelledby="dropdownMenu1" >
                    {taskNodes}
                </ul>
            </div>

        );
    }
});

var Project = React.createClass({

    render: function() {
        return(
            <li>{this.props.data.projectName}</li>
        );
    }

});


$().ready(function(){
    React.render(
        <ProjectList url="http://localhost:3000/tasks/" pollInterval={5000} />,
        document.getElementById('ProjectList')
    );
});


