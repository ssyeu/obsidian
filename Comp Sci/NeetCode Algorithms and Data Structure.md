## Detailed Explanation

Before we cover arrays, it is important to understand what a data structure is to begin with.

Data structures are a way to store data in an efficient manner inside of a computer component called **Random Access Memory** (RAM). RAM is often just referred to as **memory**. Let's understand how an array is stored in RAM.

An array is an ordered collection of contiguous elements, for example `[1, 3, 5]`. But computers only understand data in terms of bits, i.e. `0s` and `1s`.

Most computers these days have gigabytes (GBs) of RAM. The computer you are using to view this course might have 8 GB (109 bytes) of RAM. A byte of RAM is made up of exactly 8 bits.

Going back to our integers, each of `[1, 3, 5]` has a binary representation, meaning they can be represented as `0s` and `1s`. If we use a single byte to store each, then the integer `1` can be represented as `00000001`, `3` as `00000011`, and `5` as `00000101`.

When we store an array in RAM, each element is stored continously in order.

Integers commonly occupy 4 bytes (32 bits) in memory. An `address` and a `value` gets associated with an integer upon storing it in RAM. An address is just a distinct location that each one of the values is stored at. Each value is stored contiguously in the RAM, just like an array.

![Storing an integer array in RAM](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/5b898b0a-b35f-40e1-32d2-60a3ef8b7c00/sharpen=1)

> Each integer occupies 4 bytes of space, hence the addresses are 4 bytes apart.

Instead of integers, we could also store characters in an array.

![Storing a character array into RAM. Each character takes 8 bits of space, 1 byte, hence the addresses are 1 byte apart.](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/fbe06cc0-2bfb-4138-ad12-d4d0b67f9400/sharpen=1)

> Each character occupies 1 byte of space, hence the addresses are 1 byte apart.

the size or the type of data we store doesn't really matter, as long as the address is incremented relative to the size of the data type. Most of the time this knowledge is abstracted away from us as developers, but it is relevant to understand many algorithms and data structures. It is also extremely important in system design.

## Closing Notes

Although this chapter is mostly theory, the remainder of this course will focus on practical concepts. The next two chapters dive into array operations, their efficiency and usage.

