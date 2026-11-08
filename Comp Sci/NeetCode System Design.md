# Computer Architecture

Before diving into the system design process, it is paramount to understand the building blocks of a computer, their importance, and the role they play in designing systems.

---

### Components

#### Disk

A disk is the primary storage device in a computer. It is **persistent**, meaning the data will be persisted regardless of the state of the machine (turned on or off). Most modern computers store information in disk on the order of **TBs** (terabytes).

Recall that a byte is made up of 8-bits, and bit is the smallest unit of measure in computers - a binary measure represented by 00 or 11. A terabyte is 10121012 bytes, or a trillion bytes. A disk storage device like a USB drive might have storage on the order of **GBs** (gigabytes), which is 109109, or one billion bytes.

You might have come across the terms: **HDD** and **SSD**. Hard disk drives (HDD) and Solid-state drive (SSD) are both persistent storage devices, with the latter one being more popular and faster. However, it does generally cost a bit more.

> HDDs are mechanical, and have a read/write head. The older they get, the more wear and tear they collect which slows them down overtime. SSDs are significantly faster because they do not have moving parts, and rely on reading and writing data electronically (similar to RAM).

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/42dfcd00-bdf1-44ac-cfb9-6b3811e65000/sharpen=1)

#### RAM

Random Access Memory is also used for storing information but is typically a lot smaller in size compared to disk drives. RAM sizes generally vary from 1GB - 128GB because RAM is _much_ more expensive than disk space. The benefit is that reading and writing to RAM is _significantly_ faster than disk. For instance, writing 1 MB of data to RAM might take on the order of microseconds (millionths of a second, or 1/1061/106 seconds), while writing the same amount to a disk might take on the order of milliseconds (thousandths of a second, or 1/1031/103 seconds).

> **Note:** these numbers are rough estimates, and can change as hardware technology improves.

RAM keeps the applications you have open in memory, including any `variables` your program has allocated. It is often described as volatile memory, meaning that the data gets erased once the computer is shut down. This is why it is important to save your work to disk before shutting down your computer.

It is important to note that the RAM and disk do not directly communicate with each other. They rely on the CPU to facilitate data transfer between them.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/881a7a37-ad2e-4bc1-5588-fa77e0a47800/sharpen=1)

#### CPU

The central processing unit (CPU) is the intermediary between the RAM and disk. Also referred to as the "brain" of the computer; it reads/writes from the RAM and disk(s).

For example, when you write code and run it, your code is translated into a set of binary instructions stored in RAM. The CPU reads and executes these instructions, which may involve manipulating data stored elsewhere in RAM or on disk. An example of reading from disk would be opening a file in your file system and reading it line-by-line.

All computations are done within the CPU, such as addition/subtraction/multiplication etc. This occurs in a matter of milliseconds. It fetches instructions from the RAM, decodes those instructions and executes the decoded instructions. On the lowest level, all these instructions are represented as bytes.

The CPU also consists of a cache. A cache is extremely fast memory that lies on the same die as the CPU.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/cbd90cba-60fd-4a0e-47d0-46ddb8ae8400/sharpen=1)

#### Caches

Most CPUs have an L1, L2, and L3 cache, which are physical components that are much faster than RAM, but they only store data on the order of KBs or tens of MBs.

Whenever a read operation is requested, the cache is checked before the RAM and the disk. If the data requested is in the cache, and is unchanged since the last time it was accessed, it will be fetched from the cache, and not the RAM. Reading and writing to the cache is a lot faster than RAM and disk. It is up to the operating system to decide what gets stored in the cache.

Caching is an important concept applied in _many_ areas beyond computer architecture. For example, web browsers use cache to keep track of frequently accessed web pages to load them faster. This stored data might include HTML, CSS, JavaScript, and images, among other things. If the data is still valid from the time the page was cached, it will load faster. But in this case, the browser is using the disk as cache, because making internet requests is a lot slower than reading from disk.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/159f5851-56ef-474e-ecd7-d07b3c552900/sharpen=1)

> The cache being part of the CPU is only part of the reason why it is faster than RAM. Cache is what's known as SRAM. If you are interested, you might view this resource from [MIT](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/#19), which gives a gentle introduction.

---

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/e2c12423-9dec-47b7-f471-a4a057ad9000/sharpen=1)

> The visual above demonstrates how the CPU, RAM, Cache, and the disk interact with each other on an abstract level.

### Moore's Law

Moore's Law is an observation, which suggests that the number of transistors in a CPU double every two years. Looking at the visual below, it looks like a linear graph, but looking at the scale on the y-axis explains that it is exponential. So while the number of transistors doubles, the cost of computers tends to halve. In the recent years however, the number of transistors, and thus the speed of the computers, has begun to plateau.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/14f67968-0efc-4264-4af3-915ca12b5500/sharpen=1)

# Closing Notes

All three memory types have their own use. If you are writing an essay, and the computer were to shut down, you would want it stored on a disk drive. While multi-tasking, you would want the programs opened to be stored in the RAM.

Now that we have gone over computer architecture, we can start understanding application architecture, including what a distributed system is, which provides the basic anatomy of a production application from the perspective of a developer and an end-user.

# Application Architecture

In this high-level overview, we'll explore the architecture of a production-grade application. This will serve as a foundation for the rest of the course, allowing us to delve into each component in more detail later on.

Within a production application architecture, various components work together to create a robust system. While we'll provide a brief introduction to these components here, we'll cover each one extensively in separate chapters throughout the course.

---

### A developer's perspective

We can start viewing this application architecture from the perspective of a developer, which will be familiar to most of you. Developers write code that is **deployed** to a **server**. For now, let's define a **server** as a computer that handles requests from another computer. This server also requires **persistent storage** to store the application's data. A server may have built-in storage, but that has its limitations in terms of size. As such, a server may talk to an external storage system (database, cloud etc). This storage may not be part of the same server, and is instead connected through a **network**.

### A user's perspective

A user is someone who makes a request from the server, usually through a web browser. In this case, the web browser is the **client** to whom the server responds to.

If a user wanted to use a front-end feature, the server will respond with the necessary JavaScript/HTML/CSS code, compiled to display what the user requested. But, what if we have a lot of users and the single server cannot handle all of the requests on its own? There is bound to be a bottleneck, either through our RAM or our CPU. To maintain performance while dealing with multiple users, we will need to scale our server.

### Scaling our server

To handle multiple requests, it might be a good idea to add more RAM or upgrade to a CPU with more cores and higher clocking speed. However, every computer has a limitation in terms of upgrades. Upgrading components _within_ the same computer is referred to as **vertical scaling**.

We can also have multiple servers running our code, and we can distribute the user requests among these servers. This way, not all users are talking to one server, which ensures that the speed of each server remains intact. This also ensures that if one server were to go down, we can direct our traffic to one of our other servers. This is known as **horizontal scaling**.

Generally, in large systems, we prefer horizontal scaling, as it is much more powerful, and can be achieved with commodity hardware (i.e., relatively inexpensive, standard hardware). However, it also requires much more engineering effort, as we need to ensure that the servers are communicating with each other, and that the user requests are being distributed evenly.

For simple applications however, vertical scaling may be sufficient and the easier solution to implement. Even some services within [Amazon Prime Video](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90) were recently migrated from a microservice architecture to a monolithic architecture.

> But with multiple servers, what determines which requests go to which server? This is achieved through a **load balancer**. A load balancer will evenly distribute the incoming requests across a group of servers.

It's also important to remember that servers don't exist in isolation. It is highly likely that servers are interacting with external servers, through APIs. For example, the neetcode.io website interacts with other services like Stripe, through an API.

### Logging and Metrics

Servers also have **logging** services, which gives the developer a log of all the activity that happened. Logs can be written to the same server, but for better reliability they are commonly written to _another_ external server.

This gives developers insight into how the requests went, if any errors occurred, or what happened before a server crashed. However, logs don't provide the complete picture. If our RAM has become the bottleneck of our server, or our CPU resources are restricting the requests being handled efficiently, we require a **metrics** service. A metric service will collect data from different sources within our server environment, such as CPU usage, network traffic etc. This allows developers to gain insights into server's behavior and identify potential bottlenecks.

### Alerts

As developers, we wouldn't want to keep checking metrics to see if any unexpected behavior exhibits itself. This would be like checking your phone every 55 minutes for a notification. It is more ideal to receive a push notification. We can program alerts so that whenever a certain metric fails to meet the target, the developers receive a push notification. For example, if 100%100% of the user requests receive successful responses, we could set an alert to be notified if this metric dips under 95%95%.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/f54abb89-ab9b-4713-874b-7568651b2800/sharpen=1)

> The visual above demonstrates (on a very high level) how the components interact with each other, and what components the users interacts with and what components the developer interacts with.

# Closing Notes

What we discussed above is a gentle introduction, and there is a lot more that goes into application architecture than what we just talked about. For example, how do all of these components communicate with each other. What protocols do they need to abide by? Are there ways to optimize these protocols? These components could very well be scattered across different computers, so networking is required. We will discuss all this in detail in the upcoming chapters.

# Design Requirements

Let us understand the basics of designing a system and the requirements that need to be met to satisfy the quality standards of a large, and effective distributed system.

The good news is that in system design interviews, you aren't expected to know the nitty gritty details of every single component - it is more about the thought process and analysis that goes behind creating an effective distributed system. That is, as long as you have a solid idea of what direction you are going in, and can discuss trade-offs among different choices, it is acceptable.

---

### Thinking in System Design

Whenever you're faced with designing a big enterprise system, it can be boiled down to three points:

#### Moving Data

As we discussed earlier in the chapter on computer architecture, data is moved between the disk, RAM, and CPU. However, when designing large systems, our focus shifts to moving data between different clients and servers, which may be geographically dispersed across the world. This is significantly more challenging compared to local data movement.

#### Storing Data

We already discussed how storing data in RAM is different to storing data on disk. When designing large distributed systems, it is a guarantee that we will need to store data. The question is, how do we store the data? Databases? Blob Stores? File Systems? Distributed file systems? This might remind you of picking between different data structures to find the optimal solution. For example, choosing an array over a BST to store data doesn't mean that an array is better than a BST in all scenarios, but rather it depends on the use case. By the same token, we have to choose how we want to store data and which way will be the most efficient, given the scenario.

#### Transforming Data

Lastly, we want to transform data. It wouldn't be very fun if all we were doing was moving and storing data. If we were given a bunch of server logs, one way to transform this data would be to output the %% of successful requests vs %% of failed requests. This is sometimes handled by a monitoring service. Perhaps, we are given some medical records, and we want to filter the patients by age. These are just two basic examples, and there are countless ways to transform data. Regardless of how complex or how simple the process, the fundamental question is: what is the most efficient way to transform the given data?

---

### Note

In the case of data structures and algorithms, if we picked a bad algorithm, changing the code wouldn't be that challenging. For example, if you write bad code, you can always fix that code without many adverse effects.

Bad design choices in the application architecture can be very costly. Choosing the wrong database will have more severe consequences. You will have to migrate data from one database to another database and at the same time, rewrite portions of the application.

### What is good design?

The next question is: what constitutes a good design? Well, there are a number of factors, performance measures, and certain metrics that are deemed as good design. These factors are good starting points when you start to compare and contrast, i.e. figuring out trade-offs of design choices

#### Availability

Availability is at the heart of an effective system. Availability refers to the percentage of time the system is available, as in, up and running for a given period of time. Traditionally, the availability requirement was Monday-Friday, 9am to 5pm (typical workday hours). Nowadays, the systems we design need to have global connectivity, a near 24/7 operation, where requests to access the system can be made concurrently, from different timezones. Mathematically, availability is calculated by:

availability=uptimeuptime+downtimeavailability=uptime+downtimeuptime​, where uptimeuptime refers to the total amount of time the system is up and downtimedowntime refers to the amount of time the system was not available to the users.

> Downtime can be planned or unplanned. For example, downtime because of a software update, verification, or back-up is planned. But, what if there is a hardware or software failure? Perhaps a natural disaster? It's hard to predict unplanned downtime, but the chances of it occurring can be minimized.

Using the equation above, let's say that we had an uptime of 2323 hours out of 2424 hours. This would result in a total availability of 96%96%. From a system design and a business perspective, this is rather poor, because we are losing money and users for 1 hour a day.

Of course, it is ideal to have 100%100% availability, but it just simply is not possible due to unplanned downtimes. Therefore, companies will aim for _at least_ 99%99% availability. However, even 99%99% uptime means that out of 365365 days, the system would be down for 3.653.65 days. If we want to reduce the downtime by a factor of 1010, this would take our uptime to 99.9%99.9% and downtime to 0.1%0.1%. This is a big jump. Ultimately, availability is measured in terms of 99s.

A good target for companies to have is 99.999%99.999% availability, which is 55 minutes of downtime in 365365 days. This can be hard to achieve, but is important for mission critical systems.

The measure of availability is used to define SLOs (service level objectives) and SLAs (service level agreements).

SLA refers to an agreement a company makes with their clients or users to provide a certain metric of uptime, responsiveness, and responsibilities. SLO refers to an objective your team must hit to meet the SLA requirements. For example, AWS's monthly SLA is 99.99%99.99% and if not met, they refund a percentage of service credit.

#### Reliability, Fault Tolerance, and Redundancy

Reliability refers to the system's ability to perform its intended functions without failure or errors over a specified period of time. When requests are made from our server, the server might be available, but when discussing reliability, we are talking about the probability that the server won't fail. If thousands of users are making requests, or if there are DDoS attacks, how easily does our server go down? This brings us to fault tolerance.

If one portion of our system has a fault, i.e. it fails, and we have another server, it means that our server is somewhat fault tolerant. Fault-tolerance refers to how well the system can detect and heal itself from a problem, i.e. disable a function, revert to a different mode, switch to a different server.

To have fault tolerance, we can have a redundant server. Redundancy in English refers to something that is unessential. This redundancy is provided by our backup server which essentially "shadows" the contents of a server. We don't need this server, but it only comes into play if our primary server fails. Only by having this redundancy, are we able to have fault tolerance.

In this case, the second server is simply a backup. But, what if we had two servers that were both active? This would be called active-active redundancy.

**Note:** In most cases, by redundancy we mean active-active redundancy (except for the example below).

> The visuals below demonstrate a normal request with a successful response and what happens when there is a DDoS (distributed denial of service) attack. Notice that only one intended user gets the response back. In cases like this, server 2 will come into play. But it will also become overloaded, so redundancy is not a perfect solution.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/c17e0810-313e-4861-a14a-46373e43eb00/sharpen=1)  
![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/0ee5bf71-eca6-4f94-d35e-04baf3736e00/sharpen=1)

#### Throughput

Throughput refers to the amount of data or operations we can handle over some period of time. The throughput of a client making requests to a server would be measured through the number of requests per second. If we want to improve the throughput, we can perform vertical scaling. This makes sense, but as we discussed earlier, there are limitations to vertical scaling. This is where horizontal scaling would come in.

Another measure of throughput is queries/second, which is a measure of the number of requests made by the user to a server or database. Another one is bytes/second. This refers to the maximum amount of data that can be sent over a network at any given time.

Queries per second makes more sense when we are discussing design in terms of users. But what if we had a data pipeline where we are required to process given data in a different format? Here, the data isn't related to a single user, per se, so bytes/second would make more sense here.

The visuals below demonstrate two ways in which throughput may be increased.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/61560336-2df1-4f9a-4483-0d4b1f496600/sharpen=1)

> Horizontal scaling allows more requests to be handled by multiple servers.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/8613c56a-32d9-45f3-7e9f-52518ec34200/sharpen=1)

> Vertical scaling allows more requests to be handled by a single server.

#### Latency

Latency refers to the delay between the client making the request and the server responding to that request. So, while throughput refers to how many requests can be sent over a network per second, latency refers to the amount of time it takes for each individual request to be completed. Latency is not exclusive to networks, however. Recall that latency even exists within a computer's internal components, such as the RAM and the cache making requests from the CPU.

![image](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/34a56f10-7d4b-42f0-8e97-7ea9af156900/sharpen=1)

> Round trip latency for a user making a request.

## Closing Notes

We want to design effective systems that can handle failures, have a high throughput, high availability, and low latency. We will be going deeper into the what affects all these factors and how we can satisfy these requirements such that our system is efficient.