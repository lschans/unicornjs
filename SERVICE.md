#Unicorn service

##Module declaration
In the 'services' section of the config.json you can declare all of your modules. A typical declaration of a module is shown below. This example includes the demo-math service into your project
```JSON
{
  "name"                :   "math",
  "type"                :   "redis-mthread",
  "lang"                :   "node",
  "masterCode"          :   "master.js",
  "workerCode"          :   "worker.js",
  "testCode"            :   "test.js",
  "interactiveCode"     :   "interactive.js",
  "instances"           :   2,
  "threads"             :   2,
  "minThreadLifetime"   :   5000,
  "maxThreadLifetime"   :   15000,  
  "minServiceLifetime"  :   60000,
  "maxServiceLifetime"  :   300000,
  "maxExec"             :   1000
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
|instances|The number of instances of the service that should run at minimum; Should be a minimum of 2 to be redundant; if 0, the service will be declared but not automatically started|
|threads|The number of threads your service should spawn internally; Should be a minimum of 2 to be hardened|
|minThreadLifetime|The minimum time in milliseconds before a thread kills itself|
|maxThreadLifetime|The maximum time in milliseconds before a thread kills itself|
|minServiceLifetime|The minimum time in milliseconds before a service kills itself|
|maxServiceLifetime|The maximum time in milliseconds before a service kills itself|
|maxExec|The maximum execution time of your service, if exceeded the job will be forwarded to the next available service|