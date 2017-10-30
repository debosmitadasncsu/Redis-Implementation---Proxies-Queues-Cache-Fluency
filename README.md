## CSC-519 DevOps HomeWork-3
#### Name:  Debosmita Das
#### Unity Id: ddas5

## Installation Procedure
```
git clone https://github.ncsu.edu/ddas5/HW3.git
cd HW3
npm install
npm install express --save
```
## Run main.js using following command:
```
node main.js
```
## Check various commands on port 3000 like the following ones:
```
- localhost:3000/get
- localhost:3000/set
- localhost:3000/recent
- localhost:3000/upload
- localhost:3000/meow
- localhost:3000/catfact/:num
- localhost:3000/toggleCacheFeature
```
##  Screencast
```
[Video Link]()
```
## Conceptual Questions

### 1. Describe some benefits and issues related to using Feature Flags.

Feature flags are one of the best practices in software deployment that helps in continuous deployment and its benefits can be retrieved during practices dark launching, A/B testing. We can think of it as a methodology for gating functionality. With help of feature flag we can toggle on or off a functionality as per the product need. Following are the benefits of using Feature Flags:

__Benefits of Feature Flags__:

1. It is easy to deploy and test a feature before releasing. If some feature fails to work as per expectation, we can turn off that feature very easily.
2. Since new features are mainly controlled by the toggling of feature flags, integration of new code to the older base is not difficult and it simplifies integration testing as well.
3. Version comparison becomes easier with feature flags as we can check the output of different versions by just toggling the feature flag(s).
4. We can avoid the cost of maintaining and supporting long-lived branches.
5. We can maintain several features for expert and new users. With feature flags, we can show premium users and non-premium users different features entirely.
6. With feature flag we can enable phased rollout and thus ensure that there is no scalability issue.

While there are several benefits of feature flags, but we need to use them judiciously too. If not used in a controlled manner, it can cause issues like the following:

__Issues of Feature Flags__:

1. Feature flags must be short-lived. Maintaining several feature flags can be hard to track for bug fixing as we would need considerable amount of time to find which feature or combination(s) of features are causing the error.
2. If there are numerous feature flags, is difficult to track which feature flags are in production for which part of users and as a result might hamper the speed/quality of continuous deployment.
3. Feature flags make the code more fragile and brittle, harder to test, harder to understand and maintain, harder to support, and less secure.
4. A feature flag can loose priority if not tracked properly. For eg. if a feature is having bug(s) and later management doesn't want it, it is toggled off and then stays in code forever without being fixed or removed. It can make the code unnecessarily messy.
5. Every toggle comes with an overhead of requiring a robust engineering process, solid technical design and a mature toggle life-cycle management. Without proper implementation of these aspects, a feature flag can become less productive and might not serve its purpose of minimizing deployment risks.


### 2. What are some reasons for keeping servers in seperate availability zones?

There are several reasons for keeping servers in separate availability zones. These are:
1. Availability of servers across different availibility zones ensures that in case of any server outage, there is always a backup server present to handle the jobs of the former server till the former goes up again i.e. it increases reliability.
2. We can ensure copies of same data across different servers by which we can avoid loosing of data to a greater extent.
3. Loadmaster can distribute the load across servers without putting all the load on one server completely thus ensuring fast processing of requests.
4. Since all the servers in different availability zones are completely separate from each other physically, outage in one server cannot propagate to another.


### 3. Describe the Circuit Breaker pattern and its relation to operation toggles.


__Description of Pattern__:

In a distributed environment, a function can make in-memory or remote call. The problems with remote call is it can fail, or hang without a response until some timeout limit is reached. These faults, though typically correct themselves after a short period of time, but might take longer time to fix in some cases.  In these situations it might be pointless for an application to continually retry an operation that is unlikely to succeed, and instead the application should quickly accept that the operation has failed and handle this failure accordingly. Moreover, such faults may also give rise to cascading failures by blocking concurrent request on the failed operation and these blocked request might hold critical system resources such as memory, threads, database connections, and so on. Hence, to deal with such problems, it is better to fail the first failing operation immediately and to try to send through the request again only if it's like to succeed. Circuit Breaker pattern implements this ideology. It prevents an application from making additional requests when it's likely to fail and allows it to go through only when the problem causing the failure, appears to be fixed.

In circuit breaker pattern, a protected function call is wrapped in a circuit breaker object and failures are monitored. Each circuit breaker object has an attribute that stores the failure threshold. The circuit breaker object monitors the number of failures for the function call with the help of a failure counter and as soon as the failure counter reaches the threshold value, the circuit breaker trips and all other concurrent function call returns with an error. This stage of circuit breaker is known as "Open". While switching to "Open" state, the circuit breaker sets a timeout timer which controls after how much time the circuit breaker can allow a fewer number of requests to pass through. Once the timeout timer ends, the circuit breaker allows fewer requests to pass through and if they are successful, it assumes that the issue has been fixed. This stage of cirvcuit breaker is known as "Half-Open". If all the requests in the half-open stage succeeds, the circuit breaker again switches to "Closed" state and the failure counter is reset. But if any request fails, the circuit breaker switches to "Open" state and the timeout timer is set again to give the system some more time to recover itself.


__Relation to Operation Toggles__:

Operation toggles can be assumed to be of same operational utility like that of a circuit-breaker for the following reasons:

1. Operation toggle can be used to detect failures.
2. An operation toggle is switched on/off depending on the chance of occurence of failure on introduction of a feature.
3. Switching off of right combination of operation toggle can prevent concurrent request failures and hence avoid unnecessary blocking of critical system resources such as memory, threads, database connections, and so on.


### 4. What are some ways you can help speed up an application that has

### a) traffic that peaks on Monday evenings
* Caching: We can implement caching of popular requests so that we don't have to hit the server multiple times for same type of requests.

* Multiple availability zone: We can maintain several servers across different availability zones during the peak time so that we can process each request fast without putting all load on one server. Additionally, if one server goes down, we will have back up servers to maintain the request processing.

* Maintenance of Master-Slave Toggle Features: We can maintain a toggle feature that will monitor the number of hits to the server. If there is a peak time i.e. a larger number of hit received compared to normal times, the feature flag will enable backup servers as slaves and will send the write requests to the master and bypass the read requests to the slaves only. Here the data consistency can be maintained by implementing force write-off mechanism.

### b) real time and concurrent connections with peers
* Use of Load Balancers: By proper use of load balancer we can divide the load among several servers all across the system network and this will handle concurrent connection request very well as load would not be concentrated on a single server.

* Auto Scaling: Autoscaling ensures that the number of instances in a distributed environment never goes down or above from what has been set before and thus instances can be managed properly.

* Caching: We can cache the dynamic content. This will reduce the load one the servers to a great extent.


### c) heavy upload traffic
* Load Balancer: We can use load balancer to distribute the load of heavy uploading among several servers across the network.

* Buffering: Instead of processing the upload requests one by one, we can process it in batches if the upload traffic is heavy. If the upload traffic is heavy, there will be a lot of data for uploading at every moment. Hence a wait of few fraction of second and uploading a batch of files at one go won't cause much difference on the customer wait time and in return, we can hit the server lesser number of times.

* Upstream Keepalives: If we can properly increase the duration for which the connections like database connections, connection to application servers etc. stays alive, this will help us in avoiding request of same connection access several times. Instead, this will allow for increased connection reuse, cutting down on the need to open brand new connections.

* Compression of Data: We can compress size of large image, media files and likewise to help fast uploading of data. Though in this case, we might have to compromise with the quality of uploaded data.

```
Referred Links:

[Source - https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker]
[Source: https://www.nginx.com/blog/10-tips-for-10x-application-performance/]
```
