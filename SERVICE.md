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
|value|explanation|
|:---|---:|
|name|math|
|type|redis-mthread|
|lang|node|
|masterCode|master.js|
|workerCode|worker.js|
|testCode|test.js|
|interactiveCode|interactive.js|
|instances|2|
|threads|2|
|dieMin|5000|
|dieMax|15000|
|maxExec|1000|