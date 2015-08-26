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

##Unicorn cons
* Everything you send needs to be a string, so if you have a date-object you want to send, you need to convert this to a string first
* Your server will be busy, even if there are no clients online/attached. This is because of management and scheduled restarts of services

##Coding standards
* Variables are CamelCased or camelCased
* File and foldernames are separated with a - (dash)
* Objects starting with a capital are 3rd party modules
* Objects and variables starting with a lowercase letter are our own

##Hardened services
Unicorn uses hardened services if you make use of the service template as provided by the unicorn. 
What makes these services hardened? Services cluster themselves to threads, and by our recommendation every service should spawn at least 3 threads. 
Since the forwarding of the service messages is done to the threads in a 'round robin' way, there is always a next free and available thread, this prevents a lot of blocking behaviour.
Also if one thread crashes or fails, there are threads ready to process the same, or a next job.

##Unicorn shell
The unicorn shell is a way to become part of your cluster of services. When you are in your shell you are a service yourself, and are able to communicate with all of the services.
The shell provides you with a default set of commands that allow you list, start, stop, reload etc. Each service also has the possibility to register custom functions to the shell. These functions can be used for control and/or debugging

##Default services
###Broker
The broker is like a postoffice, you send a message with an address attached to it to the broker, and the broker will make sure that your message gets delivered to a recipient.
So what makes this broker different from a normal SOA-Broker? With this broker you don't send a message to a person e.g. Message to John. We send a message that can be delivered to multiple persons.
So we send a message to a function. e.g. Send a message to a painter, the broker will see which painter is free at the moment and delivers that message.
What also differs from this broker system, is that the return message is not send via the broker, in the package we add a direct return address; see it as a postal pidgeon. The answer is attached to the pidgeon and will be returned to the sender directly.

In unicorn there are always a couple of brokers, we recommend at least 3 of the to stay redundant, even when 1 broker fails. But there is only 1 active broker. As soon as that broker receives a message, it passes the stick (active flag) to the next broker.
That way all brokers are processing jobs and we can speedup the delivery, even if somebody writes blocking code by accident.

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
