## Features

This template provides code structure and gulp tasks to manage AWS Lambda code for multiple functions.

## Config

Everything is in ./config/
See docs and wiki: https://github.com/lorenwest/node-config

See function2 sources for an example of config usage in a function. 

## Gulp

gulp -T

- package:function1
- upload:function1
- deploy:function1
- invoke:function1:1
- invoke:function1:2
- package:function2
- upload:function2
- deploy:function2
- invoke:function2:1
- clean
- package
- deploy
- spec
- spec_no_cc

Any file f in ./spec/fixtures/function/ will result in new gulp task: invoke:function:f. This task invokes function remotely.
Use specs to test functions locally.

## Environment

Use NODE_ENV=qa and NODE_ENV=production env vars to change task environment.
You can change env specific options in config files.

## Specs && Code Coverage

Jasmine and Istanbul are used for testing and code coverage respectively.   

## Additional functionality

Feel free to modify ./gulp_tasks/aws_lambda.js to add additional functionality, event sources, SQS queues, etc.