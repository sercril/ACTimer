/**
 * Created by sercril on 8/26/15.
 */



module.exports = function (grunt) {
  grunt.initConfig({

      typescript: {
          base: {
            src: ["ts/**/*.ts"],
            dest: "js"
          }
      }


  });


    grunt.loadNpmTasks("grunt-typescript");
    grunt.registerTask("default", ["typescript"]);
};