var gulp = require('gulp');

// modularity for gulp tasks
require('./gulp_tasks/aws_lambda')(gulp);
require('./gulp_tasks/jasmine')(gulp);




