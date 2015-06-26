var del = require('del');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var sequence = require('run-sequence');
var merge = require('merge');
var aws = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var async = require('async');

aws.config.apiVersions = {
    lambda: '2015-03-31'
};


module.exports = function(gulp, config) {

    var config = config;

    var currentEnv = function() {
        if (gutil.env.production === true)
            return 'production';
        if (gutil.env.qa === true)
            return 'qa';
        return 'development';
    }

    var currentEnvConfig = function() {
        var env = currentEnv();
        var defaultConfig = config.default;
        var envConfig = config[env];
        return merge.recursive(defaultConfig, envConfig)
    }

    var functionConfig = function(f) {
        var curEnvConfig = currentEnvConfig();
        return merge.recursive(curEnvConfig.allFunctionsOptions, curEnvConfig.functions[f]);
    }

    var functionTasks = function(f) {

        var package = function(f, cb) {
            var fConfig = functionConfig(f);

            gulp.task('clean:' + f, function(cb) {
                del(['./dist/' + f, './dist/' + f + '.zip'], cb);
            });

            gulp.task('copy_source:' + f, function() {
                return gulp.src(['src/' + f + '.js'], {base: 'src'})
                    .pipe(gulp.dest('./dist/' + f));
            });

            gulp.task('copy_node_modules:' + f, function() {
                var sources = fConfig.packageOptions.nodeModules.map(function(m) { return 'node_modules/' + m + '/**/*'; });
                return gulp.src(sources, {base: '.'})
                    .pipe(gulp.dest('./dist/' + f));
            });

            gulp.task('copy_files:' + f, function() {
                var sources = fConfig.packageOptions.files.map(function(file) { return 'src/' + file; })
                return gulp.src(sources, {base: 'src'})
                    .pipe(gulp.dest('./dist/' + f));
            });

            gulp.task('zip:' + f, function() {
                return gulp.src('./dist/' + f + '/**/*.*')
                    .pipe(zip(f + '.zip'))
                    .pipe(gulp.dest('./dist'));
            });

            sequence('clean:' + f, 'copy_source:' + f, 'copy_node_modules:' + f, 'copy_files:' + f, 'zip:' + f, cb);
        }

        var upload = function(f, cb) {
            var fConfig = functionConfig(f);
            var lambda = new aws.Lambda({region: fConfig.deployOptions.region});

            var params = {
                FunctionName: fConfig.name,
                Handler: fConfig.deployOptions.handler,
                Role: fConfig.deployOptions.role,
                MemorySize: fConfig.deployOptions.memory,
                Timeout: fConfig.deployOptions.timeout
            };

            var updateFunction = function(cb) {
                var package = './dist/' + f + '.zip';
                fs.readFile(package, function(err, data) {
                    if(err) return cb('Error reading function package at ' + package);

                    async.series([
                        function(cb) {
                            lambda.updateFunctionCode({FunctionName: fConfig.name, ZipFile: data}, function(err, data) {
                                if (err) {
                                    var warning = 'Package upload failed. '
                                    warning += 'Check your iam:PassRole permissions.'
                                    gutil.log(warning);
                                    return cb(err);
                                }
                                cb();
                            })
                        },
                        function(cb){
                            lambda.updateFunctionConfiguration(params, function(err, data) {
                                if (err) {
                                    var warning = 'Update function configuration failed. '
                                    gutil.log(warning);
                                    return cb(err);
                                }
                                cb();
                            })
                        }
                    ], function(err) {
                        if (err) return cb(err);
                        cb();
                    });
                });
            };

            var createFunction = function(cb) {
                var package = './dist/' + f + '.zip';
                fs.readFile(package, function(err, data) {
                    if(err) return cb('Error reading function package ' + package);

                    params['Code'] =  { ZipFile: data };
                    params['Runtime'] = "nodejs";

                    lambda.createFunction(params, function(err, data) {
                        if (err) {
                            var warning = 'Function creation failed. ';
                            warning += 'Check your iam:PassRole permissions.';
                            gutil.log(warning);
                            cb(err);
                        } else {
                            cb();
                        }
                    });
                });
            };

            lambda.getFunction({FunctionName: fConfig.name}, function(err, data) {
                if (err) {
                    if (err.statusCode === 404) {
                        createFunction(cb);
                    } else {
                        var warning = 'AWS API request failed. '
                        warning += 'Check your AWS credentials and permissions.'
                        gutil.log(warning);
                        cb(err);
                    }
                } else {
                    updateFunction(cb);
                }
            });
        }

        var invoke = function(f, payload, cb) {
            var fConfig = functionConfig(f);
            var lambda = new aws.Lambda({region: fConfig.deployOptions.region});

            fs.readFile(payload, function(err, data) {
                if(err) return cb('Error reading function payload ' + payload);

                gutil.log("Payload:\n", data.toString());

                lambda.invoke({FunctionName: fConfig.name, InvocationType: 'RequestResponse', Payload: data}, function(err, data) {
                    if (err) {
                        var warning = 'Function invocation failed. ';
                        gutil.log(warning);
                        cb(err);
                    } else {
                        gutil.log("Response:\n", data);
                        cb();
                    }
                });
            });
        }

        gulp.task('package:' + f, function (cb) {
            package(f, cb);
        });

        gulp.task('upload:' + f, function (cb) {
            upload(f, cb);
        });

        gulp.task('deploy:' + f, function (cb) {
            sequence('package:' + f, 'upload:' + f, cb);
        });

        var payloads = fs.readdirSync('./spec/fixtures/' + f);
        payloads.forEach(function(p) {
            var payloadName = path.basename(p, '.json');
            var payload = './spec/fixtures/' + f + '/' + p;
            gulp.task('invoke:' + f + ':' + payloadName, function (cb) {
                invoke(f, payload, cb);
            });
        })
    }


    for (var f in currentEnvConfig().functions) {
        functionTasks(f);
    };

    gulp.task('clean', function(cb) {
        del(['./dist'], cb);
    });

    gulp.task('package', function(cb) {
        var functionsSubTasks = [];
        for (var f in currentEnvConfig().functions) { functionsSubTasks.push('package:' + f) };
        sequence('clean', functionsSubTasks, cb);
    });

    gulp.task('deploy', function(cb) {
        var functionsSubTasks = [];
        for (var f in currentEnvConfig().functions) { functionsSubTasks.push('deploy:' + f) };
        sequence(functionsSubTasks, cb);
    });



}