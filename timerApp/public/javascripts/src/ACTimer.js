var selectStyle= {
    color:'#000',
    width: '100%',
    padding: '8px 5px',
    fontSize: '16px'
};


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
        setInterval(this.loadTasksFromServer(), this.props.pollInterval);
    },
    render: function () {
        var taskNodes = this.state.data.map(function (task) {
            return (
                <Project data={task} />
            );
        });
        return(

            <select name="project" style={selectStyle}>
                {taskNodes}
            </select>


        );
    }
});

var Project = React.createClass({

    render: function() {
        return(
            <option value="{this.props.data.projectId}">{this.props.data.projectName}</option>
        );
    }

});


$().ready(function(){
    React.render(
        <ProjectList url="http://localhost:3000/projects/" pollInterval={5000} />,
        document.getElementById('ProjectList')
    );
});


