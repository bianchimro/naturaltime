var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('minapp', function () {
        var a= gulp.src([
          'www/js/colore-services.js',
          'www/js/app.js',
          'www/js/humane-service.js',
          'www/js/controllers.js',
          'www/js/directives.js',
          'www/js/image-picker.js',
          'www/js/app-restrictions.js',
          'www/js/controllers/single-color-palette-ctrl.js'
        ])
        .pipe(ngAnnotate())
        .pipe(uglify({mangle: true}))
        .pipe(concat('dist.js'))
        .pipe(gulp.dest('dist/js'));

        var b = gulp.src('www/**/*.html')
        //.pipe(minifyHtml())
        .pipe(gulp.dest('dist'));

    
        /*
        gulp.src([
          'www/lib/tinycolor/tinycolor.js', 
          'www/lib/tinycolor/crayolaColors.js',
          'www/lib/tinycolor/wikiColors.js',
          'www/lib/color-thief/color-thief.js'
          ])        
          .pipe(uglify({mangle: false}))
          .pipe(concat('libcolor.js'))
          .pipe(gulp.dest('dist/lib'));

        */
        
        var c = gulp.src('www/lib/**/*.*')
        .pipe(gulp.dest('dist/lib'));

        gulp.src("www/img/*.*")
        .pipe(gulp.dest('dist/img'));

        gulp.src("www/icons/*.*")
        .pipe(gulp.dest('dist/icons'));

        gulp.src("www/fonts")
        .pipe(gulp.dest('dist/fonts'));
        
        var d = gulp.src('www/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));

        return a && b && d;


});
