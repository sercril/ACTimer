function ProjectsHelper($http){
	this.returnProjects = [];
	
	this.GetProjects = function() {
		$http.get('/projects').success(function(data){
			this.returnProjects = data;
		})
		.error(function (data, status) {
			this.returnProjects = "error";
		});
		
		return this.returnProjects;
	};
}