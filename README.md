## Features

This template provides code structure and gulp tasks to manage AWS Lambda code for multiple functions.

## Config

Everything is in ./config/aws_lambda.js

## Gulp

gulp -T

├── package:function1
├── upload:function1
├── deploy:function1
├── invoke:function1:1
├── invoke:function1:2
├── package:function2
├── upload:function2
├── deploy:function2
├── invoke:function2:1
├── clean
├── package
├── deploy
└── spec

Any file <f> in ./spec/fixtures/<function>/ will result in new gulp task: invoke:<function>:<f>. This task invokes function remotely.
Use specs to test functions locally.

Feel free to modify ./gulp_tasks/aws_lambda.js to add additional functionality, event sources, SQS queues, etc.