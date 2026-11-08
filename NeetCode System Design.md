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

