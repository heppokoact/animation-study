var gulp = require("gulp");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify-es").default;
var browserSync = require("browser-sync");

const paths = {
  html: "./src/",
  dist: "./dist/",
  cssSrc: "./src/scss/",
  css: "./dist/css/",
  jsSrc: "./src/js/",
  js: "./dist/js/"
};

// Sass

var sassOptions = {
  outputStyle: "compressed"
};
function buildSass() {
  return gulp
    .src(paths.cssSrc + "**/*.scss", {
      sourcemaps: true,
      since: gulp.lastRun(buildSass)
    })
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css, { sourcemaps: true }))
    .pipe(browserSync.reload({ stream: true }));
}

// js

function buildJs() {
  return gulp
    .src(paths.jsSrc + "**/*.js", {
      sourcemaps: true,
      since: gulp.lastRun(buildJs)
    })
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.js, { sourcemaps: true }))
    .pipe(browserSync.reload({ stream: true }));
}

// html

function buildHtml() {
  return gulp
    .src(paths.html + "**/*.html", { since: gulp.lastRun(buildHtml) })
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.reload({ stream: true }));
}

// Browser sync

function serve(done) {
  browserSync({
    server: {
      baseDir: paths.dist
    }
  });
  done();
}

// watch

function watch() {
  gulp.watch(paths.cssSrc + "**/*.scss", buildSass);
  gulp.watch(paths.jsSrc + "**/*.js", buildJs);
  gulp.watch(paths.html + "**/*.html", buildHtml);
}

// default

exports.default = gulp.series(
  gulp.parallel(buildSass, buildJs, buildHtml),
  gulp.parallel(serve, watch)
);
