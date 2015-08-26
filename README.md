#![unicorn basics](/images/title-bar.png)
##Lure the unicorn out of the bush
* The unicorn micro-service infrastructure is a distributed way of delivering data and services redundant, reliable and multi-threaded.
* Unicorn reduces the pain of micro-services and keeps the focus on the logic you need in your project.
* Unicorn is fully backed by Redis.
* Unicorn is infinite scalable.
* All services are 'hardened' out of the box
* Services and threads automatically kill and respawn themselves, this prevents memory leaks, crashed services, and increases the overal stabilty of the platform
* Hybrid service development, use nodejs, PHP, or some other language of choice

##The basic idea
![unicorn basics](/images/service-dataflow.png)

##Unicorn pro's
* Endless distribution of data as far as data centers reach
x
##Unicorn cons
* Everything you send needs to be a string, so if you have a date-object you want to send, you need to convert this to a string first

##Coding standards
* Variables are CamelCased
* Objects starting with a capital are 3rd party modules
* Objects and variables starting with a lowercase letter are our own

##Unicorn modules
###redis-mthread
* A multi-threaded listener service for redis.
* Every service has a redis-mthread and initialized by asking to the brokers for a channel.

###bus-init
* The unicorn service initializer, this module must be included in every service to inform the broker that we are up

###bus-msg
* The unicorn message, this module provides services with a clean message

###bus-talk
* The unicorn talk protocol, this module takes care of messages going over the bus
