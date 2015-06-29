var jasmine = require('gulp-jasmine');
var istanbul = require('gulp-istanbul');

module.exports = function(gulp) {

    gulp.task('spec', function () {

        return gulp.src(['src/**/*.js'])
            .pipe(istanbul({includeUntested: true}))
            .on('finish', function() {
                gulp.src('spec/**/*.spec.js')
                    .pipe(jasmine())
                    .pipe(istanbul.writeReports({
                        dir: './coverage',
                        reporters: [ 'lcov' ],
                        reportOpts: { dir: './coverage' }
                    }));
            });
    });

    gulp.task('spec_no_cc', function () {

        return gulp.src('spec/**/*.spec.js')
            .pipe(jasmine());
    });

}

