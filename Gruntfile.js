module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    /************************************************
    * GENERAL
    ************************************************/
    , clean:{
      all_dis:['dist']
    }
    , concat:{
      lib_bower: {
        src: [
          'bower_components/jquery/dist/jquery.min.js'
          ,'bower_components/rsvp/rsvp.min.js'
          ,'bower_components/requirejs/require.min.js'
        ]
        ,dest: 'dist/js/lib/lib.js'
      }
    }
    ,uglify:{
      js_app:{
        options: {
          mangle: ['$']
        }
        ,expand: true
            ,cwd: 'src/js'
            ,src: '**/*.js'
            ,dest: 'dist/js'
      }
      ,require_js:{
        options: {
          mangle: ['requirejs', 'require', 'define']
        }
        ,files: {
          'bower_components/requirejs/require.min.js': 
            ['bower_components/requirejs/require.js']
        }
      }
    }
    , watch:{
      js_app:{
        files: ['src/js/**/*.js']
        ,tasks:['jshint', 'uglify']
      }
      ,css_app:{
        options: {
          livereload: true
        }
        ,files: ['src/css/**/*.scss']
        ,tasks: ['compass', 'uncss']
      }
      ,html_app:{
        files: ['src/app/**/*.asp']
        ,tasks: ['htmlmin:asp_app']
      }
      , html_js_app:{
        options: {
          livereload: true
        }
        ,files: ['src/js/**/*.js', 'src/app/**/*.asp']
        ,tasks:['jshint', 'uglify', 'htmlmin:asp_app']
      }
    }
    /************************************************
    * JS
    ************************************************/
    ,jshint:{
      options: grunt.file.readJSON('config/jshint.json')
      ,grunt: ['Gruntfile.js']
      ,js_app: ['src/js/**/*.js']
    }
    /************************************************
    * HTML
    ************************************************/
    ,htmlmin:{
      asp_app:{
        options: {                                 // Target options 
          removeComments: true,
          collapseWhitespace: true
        }
        ,files: {
          'dist/index.asp' : 'src/app/index.asp'
        }
      }
    }
    /************************************************
    * CSS
    ************************************************/
    ,compass:{
      css_app:{
        options:{
          config: 'config/config.rb'
        } 
      }
    }
    ,uncss: {
      css_app:{
        files:{
          'dist/css/screen.css': ['<%=pkg.dir.index%>']
        }
      }
    }
    ,cssmin:{
      css_app:{
        files:[{
          expand: true
          ,cwd: 'dist/css'
          ,src: ['*.css']
          ,dest: 'dist/css'

        }]
      }
    }
    /************************************************
    * IMG
    ************************************************/
    ,imagemin:{
      stat: {
        files:[{
          expand: true
          , cwd: 'src/img'
          , src: ['**/*.{png,jpg,gif}']
          , dest: 'dist/img'
        }]
      }
    }
  });

  /************************************************
  * Cargamos todos los plugins
  ************************************************/
  require('load-grunt-tasks')(grunt);

  /************************************************
  * Creamos las distintas tareas
  ************************************************/
  //Desarrollo
  grunt.registerTask('dev', [
                    'jshint'
                    , 'uglify:js_app'
                    , 'htmlmin:asp_app'
                    , 'watch:html_js_app']);
  grunt.registerTask('dev_css', ['compass', 'uncss', 'watch:css_app']);
  //Producción
  grunt.registerTask('prod', [
                        'htmlmin'
                        ,'uglify'
                        , 'concat:lib_bower'
                        ,'compass'
                        , 'uncss'
                        , 'cssmin'
                        , 'imagemin']);
  grunt.registerTask('prod_asp', ['htmlmin']);
  grunt.registerTask('prod_js', ['concat:lib_bower']);
  grunt.registerTask('prod_css', ['compass', 'uncss', 'cssmin']);
  grunt.registerTask('prod_img', ['imagemin']);
  grunt.registerTask('prod_clean', ['clean:all_dis']);
  grunt.registerTask('rebuild', ['clean:all_dis', 'prod']);
};