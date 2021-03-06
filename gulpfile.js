'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require("gulp-util");

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer");

var less = require('gulp-less');
var uglifycss = require('gulp-uglifycss');

var del = require('del');
var merge2 = require('merge2');
var runSequence = require('run-sequence');

var gulpWebpack = require('gulp-webpack');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackConfig_examples = require('./examples/webpack.config.js');

var paths = {
    entries: [
        'src/**/*.js',
        '!src/i18n/*.js',
    ],
    dist: 'dist/pum/scripts',
    dist_css: 'dist/pum/styles',
    common_less: 'less/common/common.less',
    themes_less: 'less/themes/*.less',
    visualization_less: 'less/visualization/visualization.less',
    login_less: 'less/login/*.less',
    locale: 'dist/pum/i18n',
    demo: {

    }
};

/**
 * react-ui build
 */
gulp.task('clean.ui', function() {
    return del(['dist/*.js', 'dist/*.map', 'dist/*.css', 'dist/images/']);
});

gulp.task('build.ui', ['clean.ui'], function(callback) {
    webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('build.ui', err);
		gutil.log('[build.ui]', stats.toString({
			colors: true
		}));
		callback();

        var rename = require('gulp-rename');
        return gulp.src('dist/react-ui.js')
                .pipe(uglify())
                .pipe(rename({extname: '.min.js'}))
                .pipe(gulp.dest('dist'));
	});
});

/**
 * examples build
 */
gulp.task('clean.examples', function() {
    return del(['examples/build/*.js', 'examples/build/*.map']);
});

gulp.task('build.examples', ['clean.examples'], function(callback) {
    webpack(webpackConfig_examples, function(err, stats) {
		if(err) throw new gutil.PluginError('build.examples', err);
		gutil.log('[build.examples]', stats.toString({
			colors: true
		}));
		callback();
	});
});




/**
 * webpack (old)
 */
gulp.task('clean.js', function() {
    return del([paths.dist + '/react-one.js', paths.dist + '/react-one.min.js']);
});

gulp.task('build.js', ['clean.js'], function () {
    return merge2(
                browserify({
                    entries: 'react-one.js',
                    extensions: ['.js'],
                    standalone: 'Pum',
                    debug: true
                })
                    .transform(babelify, {presets: ["es2015", "react"]})
                    .bundle()
                    .pipe(source('react-one.js'))
                    //.pipe(derequire())
                    .pipe(gulp.dest(paths.dist)),
                browserify({
                    entries: 'react-one.js',
                    extensions: ['.js'],
                    standalone: 'Pum',
                    debug: true
                })
                    .transform(babelify, {presets: ["es2015", "react"]})
                    .bundle()
                    .pipe(source('react-one.min.js'))
                    //.pipe(derequire())
                    .pipe(buffer())
                    .pipe(uglify())
                    .pipe(gulp.dest(paths.dist))
            );

});

gulp.task('watch', ['build.js'], function () {
    gulp.watch('*.js', ['build.js']);
});

// Rerun tasks whenever a file changes.
/*
gulp.task('watch', function() {
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
});

 gulp.task('default', ['watch', 'css', 'js']);
*/

// locale(i18n)
gulp.task('clean.locale', function() {
    return del(paths.locale + '/*.js');
});

gulp.task('build.locale', ['clean.locale'], function () {
    var rename = require('gulp-rename');
    return merge2(
        gulp.src('src/i18n/*.js')
            .pipe(gulp.dest(paths.locale)),
        gulp.src('src/i18n/*.js')
            .pipe(uglify())
            .pipe(rename({extname: '.min.js'}))
            .pipe(gulp.dest(paths.locale))
    );
});

// demo build
gulp.task('clean.demo', function() {
    return del('demo/scripts/*.bundle.js');
});

gulp.task('build.demo', ['clean.demo'], function(callback) {
    //var demoWebpackConfig = require("./demo/webpack.config.js");
    return gulp.src('demo/src/app.js')
        .pipe(gulpWebpack({
            entry: {
                app: './demo/src/app.js',
                liveobject: './demo/link/liveobject/app.js',
                report: './demo/link/report/app.js'
            },
            output: {
                filename: '[name].bundle.js'
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ["react", "es2015"],
                            cacheDirectory: true
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest('demo/scripts'));
});

/**
 * CSS
 */
gulp.task('clean.css', function() {
    return del(paths.dist_css + '/**/*');
});

gulp.task('build.css:less', ['clean.css'], function() {
    return merge2(
        gulp.src(paths.common_less)
            .pipe(less())
            .pipe(gulp.dest(paths.dist_css)),
        gulp.src(paths.themes_less)
            .pipe(less())
            .pipe(gulp.dest(paths.dist_css + '/themes')),
        gulp.src(paths.visualization_less)
            .pipe(less())
            .pipe(gulp.dest(paths.dist_css)),
        gulp.src(paths.login_less)
            .pipe(less())
            .pipe(gulp.dest(paths.dist_css + '/login'))
    );

});

gulp.task('build.css:min', function() {
    var rename = require('gulp-rename');

    return merge2(
        gulp.src(paths.dist_css + '/common.css')
            .pipe(uglifycss())
            .pipe(rename({extname: '.min.css'}))
            .pipe(gulp.dest(paths.dist_css)),
        gulp.src(paths.dist_css + '/themes/*.css')
            .pipe(uglifycss())
            .pipe(rename({extname: '.min.css'}))
            .pipe(gulp.dest(paths.dist_css + '/themes')),
        gulp.src(paths.dist_css + '/visualization.css')
            .pipe(uglifycss())
            .pipe(rename({extname: '.min.css'}))
            .pipe(gulp.dest(paths.dist_css)),
        gulp.src(paths.dist_css + '/login/*.css')
            .pipe(uglifycss())
            .pipe(rename({extname: '.min.css'}))
            .pipe(gulp.dest(paths.dist_css + '/login'))
    );
});

gulp.task('build.css', function(done) {
    runSequence('build.css:less', 'build.css:min', done);
});

gulp.task('default', ['build.js', 'build.css']);