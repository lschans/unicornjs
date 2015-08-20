# unicorn
##Lure the unicorn out of the forest
* The unicorn micro-service infrastructure is a distributed way of delivering data and services redundant, reliable and multi-threaded.
* Unicorn reduces the pain of micro-services and keeps the focus on the logic you need in your project.
* Unicorn is fully backed by Redis.
* Unicorn is infinite scalable.

##Coding standards
* Variables are CamelCased
* Objects starting with a capital are 3rd party modules
* Objects and variables starting with a lowercase letter are our own

##Unicorn modules
###redis-mthread
* A multi-threaded listener service for redis.

###bus-init
* The unicorn service initializer, this module must be included in every service to inform the broker that we are up

###bus-msg
* The unicorn message, this module provides services with a clean message

###bus-talk
* The unicorn talk protocol, this module takes care of messages going over the bus