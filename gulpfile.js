var gulp = require('gulp');

// modularity for gulp tasks
require('./gulp_tasks/aws_lambda')(gulp, require('./config/aws_lambda.js'));
require('./gulp_tasks/jasmine')(gulp);




