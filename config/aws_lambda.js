module.exports = {
    default: {
        allFunctionsOptions: {
            deployOptions: {
                region: 'us-east-1',
                role: 'arn:aws:iam::552254306343:role/lambda_exec_role',
                memory: 128,
                timeout: 3
            }
        },
        functions: {
            function1: {
                name: 'function1',
                deployOptions: {
                    handler: 'function1.handler'
                },
                packageOptions: {
                    nodeModules: [
                        "del"
                    ],
                    files: [
                        "lib/common.js"
                    ]
                }
            },
            function2: {
                name: 'function2',
                deployOptions: {
                    handler: 'function2.handler'
                },
                packageOptions: {
                    nodeModules: [
                        "del"
                    ],
                    files: [
                        "lib/common.js"
                    ]
                }
            }
        }
    },
    development: {
        allFunctionsOptions: {
            deployOptions: {
                role: 'arn:aws:iam::552254306343:role/lambda_exec_role',
                memory: 256,
                timeout: 5
            }
        },
        functions: {
            function1: {
                name: 'function1-dev'
            },
            function2: {
                name: 'function2-dev'
            }
        }
    },
    qa: {
        allFunctionsOptions: {
            deployOptions: {
                role: 'arn:aws:iam::552254306343:role/lambda_exec_role',
                memory: 512,
                timeout: 10
            }
        }
    },
    production: {
        allFunctionsOptions: {
            deployOptions: {
                role: 'arn:aws:iam::123456789012:role/lambda_exec_role',
                memory: 1024,
                timeout: 60
            }
        }
    }

};