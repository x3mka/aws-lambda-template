module.exports = {

  defaultDeployOptions: {
      region: 'us-east-1',
      role: 'arn:aws:iam::552254306343:role/lambda_exec_role',
      memory: 128,
      timeout: 3
  },

  functions: {
    function1: {
      name: 'function1',
      deployOptions: {
        handler: 'function1.handler',
        memory: 512,
        timeout: 60
      },
      packageOptions: {
        nodeModules: [
          "async"
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
          "async"
        ],
        files: [
          "lib/common.js"
        ]
      },
      configOptions: {
        prop: 'test'
      }
    }
  }

}

