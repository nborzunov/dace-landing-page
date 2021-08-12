const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');

const styles = () => {
    return src('src/styles/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(dest('build/styles/'));
};
const html = () => {
    return src('src/index.html')
        .pipe(replace('main.sass', 'main.css'))
        .pipe(dest('build'))
}
const img = () => {
    return src('src/img/**')
      .pipe(imagemin())
      .pipe(dest('build/img'))
  }
const cleanBuild = () => {
    return src('build', {read: false, allowEmpty: true})
        .pipe(clean())
};

const syncFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'build/'
        },
        port: 3000,
        notify: false
    })
};
const watchFiles = () => {
    watch('src/**/*.html', html)
    watch('src/styles/**/*.sass', styles)
    watch('src/img/**/*', img)
};


exports.dev = series(
    cleanBuild,
    parallel(styles, html, img),
    parallel(watchFiles, syncFiles)
);