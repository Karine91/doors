var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');    
var clean = require('gulp-clean');
var sass = require("gulp-sass");
var postcss    = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');

//Build
gulp.task('build', function () {
    return gulp.src('app/**/*.*')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest('dist'));
});


//pug
gulp.task('pug', function() {
    return gulp.src('./pug/*.pug')
        .pipe(plumber({
            errorHandler: function(error){console.log(error); this.end();}
        }))
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('app/'))
});

//Server
gulp.task('server', function(){
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});


//Clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//fonts
gulp.task('fonts', function(){
    return gulp.src('app/fonts/' + "*.*")
        .pipe(gulp.dest('dist/fonts'));
});

//images
gulp.task('images', function(){
    return gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
});

//SCSS
gulp.task('scss', function () {
    return gulp.src('./scss/style.scss')
        .pipe(plumber({
            errorHandler: function(error){console.log(error); this.end();}
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});

//POSTCSS
gulp.task('postcss', function () {
    return gulp.src('./app/css/style.css')
        .pipe(plumber({
            errorHandler: function(error){console.log(error); this.end();}
        }))
        .pipe( sourcemaps.init() )
        .pipe( postcss([ require('precss'), require('autoprefixer')]) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./app/css/'));
});

//watch
gulp.task('watch', function(){
    gulp.watch('pug/**/*.pug', gulp.series('pug'));
    gulp.watch('./scss/**/*.scss', gulp.series('scss' , 'postcss'));
    gulp.watch([
        'app/*.html',
        'app/css/**/*.css',
        'app/js/**/*.js'
    ]).on('change', browserSync.reload);
});

//default
gulp.task('default', gulp.series('pug','scss','postcss', gulp.parallel('server', "watch")));

//build
gulp.task('deploy', gulp.series('clean', gulp.parallel('build', 'fonts', 'images')));