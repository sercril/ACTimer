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
            <ul class="nav nav-pills">
                <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
                        Project <span class="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                        {taskNodes}
                    </ul>
                </li>
            </ul>

        );
    }
});

var Project = React.createClass({

    render: function() {
        return(
            <li><a href="#">{this.props.data.projectName}</a></li>
        );
    }

});


$().ready(function(){
    React.render(
        <ProjectList url="http://localhost:3000/projects/" pollInterval={5000} />,
        document.getElementById('ProjectList')
    );
});


