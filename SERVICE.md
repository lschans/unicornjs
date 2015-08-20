#Unicorn service

##Module declaration
In the 'services' section of the config.json you can declare all of your modules. A typical declaration of a module is shown below. This example includes the demo-math service into your project
```JSON
{
  "name":"math",
  "type":"redis-mthread",
  "lang":"node",
  "masterCode":"master.js",
  "workerCode":"worker.js",
  "testCode":"test.js",
  "interactiveCode":"interactive.js",
  "instances":2,
  "threads":2,
  "dieMin":5000,
  "dieMax":15000,
  "maxExec":1000
}
```

##Explanation of the values
|VALUE|EXPLANATION|
|:---|:---|
|name|The name of the module, the name of your module folder in the unicorn-services folder should be the same|
|type|The type of the service, this can be redis-mthread, http-mthread; or any other type you created a unicorn module for|
|lang|The language the service is written in, this could be node, php, etc|
|masterCode|The file that contains the master code for your service|
|workerCode|The file that contains the worker/threaded code for you service|
|testCode|The file containing the test for your service, the service will only start if the test passes|
|interactiveCode|The file containing the interactive functions for your service, these functions will be exposed to the shell and the serivce manager|
|instances|The number of instances of the service that should run at minimum; Should be a minimum of 2 to be redundant|
|threads|The number of threads your service should spawn internally; Should be a minimum of 2 to be hardened|
|dieMin|The minimum time in milliseconds before a thread kills itself|
|dieMax|The maximum time in milliseconds before a thread kills itself|
|maxExec|The maximum execution time of your service, if exceeded the job will be forwarded to the next available service |