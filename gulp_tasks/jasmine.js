var jasmine = require('gulp-jasmine');

module.exports = function(gulp) {

    gulp.task('spec', function () {
        return gulp.src('spec/**/*.spec.js')
            .pipe(jasmine());
    });

}

