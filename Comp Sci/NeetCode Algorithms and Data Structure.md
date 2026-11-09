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

# Static Arrays

In statically typed languages like Java, C++ and C#, arrays have to have an allocated _size and type_ when initialized. These are known as **static arrays**.

They are called static because the size of the array cannot change once declared. And once the array is full, it can _not_ store additional elements. Some dynamically typed languages such as Python and JavaScript do not have static arrays to begin with. They have an alternative, which we will discuss in the next lesson.

Let's cover the key operations of an array, and the time complexity associated with each.

## Reading from an array

To read an individual element from an array we can choose the position we want to access via an **index**. Below we have initialized an array of size `3` called `myArray`. We also attempt to access an arbitrary element using the index `i`.

```python
# initialize myArray
myArray = [1,3,5]

# access an arbitrary element, where i is the index of the desired value
myArray[i]
```

![reading-from-array](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/d993dba7-19fa-4dae-748b-1a7a1d9e0900/sharpen=1)

Accessing a single element in an array is always instant because each index of `myArray` is mapped to an address in the RAM. Regardless of the size of the input array, the time taken to access a single element is the same. We refer to this operation as O(1)O(1) in terms of time complexity.

> There is a common confusion that O(1)O(1) is always fast. This is not the case. There could be 10001000 operations and the time complexity could still be O(1)O(1). If the number of operations does not grow as the size of the data or input grows then it is O(1)O(1).

### Traversing through an array

We can also read all values within an array by traversing through it. Below are examples of how we could traverse `myArray` from the start to the end using loops.

```python
for i in range(len(myArray)):
   print(myArray[i])

# OR

i = 0
while i < len(myArray):
   print(myArray[i])
   i += 1
```

> The last element in an array is always at index n−1n−1 where nn is the size of the array. If the size of our array is 33, the last accessible index is 22.

To traverse through an array of size nn the time complexity is O(n)O(n). This means the number of operations grows linearly with the size of the array.

For example, with an array of size `10` we would have to perform `10` operations to traverse through it, with an array of size `100` we would have to perform `100` operations, and so on.

---

## Deleting from an array

### Deleting from the end of the array

In statically typed languages, all array indices are filled with `0s` or some default value upon initialization, denoting an empty array.

When we want to remove an element from the **last index** of an array, setting its value to `0` / `null` or `-1` is the best we can do. This is known as a **soft delete**. The element is not being "deleted" per se, but it is being overwritten by a value that denotes an empty index. We will also reduce the length by `1` since we have one less element in the array after deletion. The code below demonstrates the concept using `[4, 5, 6]` as an example.

```python
# Remove from the last position in the array if the array
# is not empty (i.e. length is non-zero).
def removeEnd(arr, length):
    if length > 0:
        # Overwrite last element with some default value.
        # We would also consider the length to be decreased by 1.
        arr[length - 1] = 0
```

![deletion-at-end](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/abf96287-60e4-460a-b480-04804743ae00/sharpen=1)

> 66 is deleted/overwritten by either 00 or −1−1 to denote that it does not exist anymore. Length is also decremented by 11.

### Deleting at an Ith Index

If instead of deleting at the end, we wanted to delete an element at a random index `i`. Would we be able to perform this in O(1)O(1)?

We could naively just replace it with a `0`, but this would break the contiguous nature of our array. Notice that deleting from the end of an array doesn't make it non-contigious, but deleting from the middle will.

A better approach would be the following:

1. We are given the deletion index `i`.
2. We iterate starting from `i + 1` until the end of the array.
3. We shift each element `1` position to the left.
4. (Optional) We replace the last element with a `0` or `null` to mark it empty, and decrement the length by `1`.

The following code demonstrates this operation.

```python
# Remove value at index i before shifting elements to the left.
# Assuming i is a valid index.
def removeMiddle(arr, i, length):
    # Shift starting from i + 1 to end.
    for index in range(i + 1, length):
        arr[index - 1] = arr[index]
    # No need to 'remove' arr[i], since we already shifted
```

![removal-0th-index](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/c548890a-6c61-4359-c96a-c04073291300/sharpen=1)

> The worst case would be that we need to shift **all** of the elements to the left. This would occur if the target index is the first index of the array. Therefore, the code above is O(n)O(n).

## Insertion

### Inserting at the end

If we want to insert an element at the end of the array, we can simply insert it at the next open position which will be at index `length` where `length` is the number of elements in the array.

```python
# Insert n into arr at the next open position.
# Length is the number of 'real' values in arr, and capacity
# is the size (aka memory allocated for the fixed size array).
def insertEnd(arr, n, length, capacity):
    if length < capacity:
        arr[length] = n
```

> Since we are writing a single value to the array, the time complexity is O(1)O(1).

**Note:** `length` is the number of elements inside the array whereas `capacity` refers to the maximum number of elements the array can hold.

### Inserting at the Ith Index

Inserting at an arbitrary index `i` is more involved since we may insert in the middle of the array.

Consider the array `[4, 5, 6]`. If we need to insert at index `i = 1`, or `i = 0`, we cannot overwrite the original value because we would lose it. Instead, we will need to shift all values, starting at index `i`, one position to the right. Below is the code and visual demonstrating this.

```python
# Insert n into index i after shifting elements to the right.
# Assuming i is a valid index and arr is not full.
def insertMiddle(arr, i, n, length):
    # Shift starting from the end to i.
    for index in range(length - 1, i - 1, -1):
        arr[index + 1] = arr[index]
    
    # Insert at i
    arr[i] = n
```

The below image visualizes the insertion of `8` at index `1` in the array `[4, 5, 6]`. Since we don't have enough space to keep the last element `6`, it is lost.

![insertion-at-i](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/50e76532-cea7-4680-1cde-0e4756477800/sharpen=1)

> The visual above demonstrates that shifting occurs prior to insertion to ensure values are not overwritten.

## Time Complexity

|Operation|Big-O Time|Notes|
|---|---|---|
|Reading|O(1)O(1)||
|Insertion|O(n)O(n)*|If inserting at the end of the array, O(1)O(1)|
|Deletion|O(n)O(n)*|If deleting at the end of the array, O(1)O(1)|

## Closing Notes

The operations we discussed above are _absolutely critical_ for solving a lot of interview problems. In fact, the key to solving many problems is being able to implement the insert middle and delete middle operations efficiently.

There are some suggested problems listed above. If you are a beginner you may find them challenging. That's completely okay, your goal should be to understand the concepts and the operations we discussed above. The solution code and video explanation are provided for each problem.

# Dynamic Arrays

Dynamic Arrays are a much more common alternative to static arrays. They are useful because they can grow as elements are added. In JavaScript and Python, these are the default arrays.

Unlike static arrays, with dynamic arrays we don’t have to specify a size upon initialization.

In different languages, dynamic arrays may be assigned a default size - Java being 1010 and C# being 44. Regardless, these are automatically resized at runtime as the arrays grow.

## Dynamic Array Insertion

When inserting at the end of a dynamic array, the next empty space is found and the element is inserted there. Consider an array of size 33 where we push elements into it until we run out of space.

```python
# Insert n in the last position of the array
def pushback(self, n):
    if self.length == self.capacity:
        self.resize()
        
    # insert at next empty position
    self.arr[self.length] = n
    self.length += 1
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/824e8bac-c064-4597-5d67-23c4d15f0900/sharpen=1)

## Resize

Since the array is dynamic in size, we can continue to add elements. But it's not magic, this is achieved by copying over the values to a new static array that is double the size of the original. This means that the resulting array will be of size 66 and will have new space allocated for it in memory. The following visual and code demonstrates this resize operation.

```python
def resize(self):
    # Create new array of double capacity
    self.capacity = 2 * self.capacity
    newArr = [0] * self.capacity 

    # Copy elements to newArr
    for i in range(self.length):
        newArr[i] = self.arr[i]
    self.arr = newArr
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/806bc423-9672-4c40-3f1a-3a27a7aef400/sharpen=1)

> When all the elements from the first array have been copied over, the first static array will be deallocated.

Adding elements to a dynamic array runs in O(1)O(1) _**amortized**_ time.

Amortized time complexity is the average time taken per operation over a sequence of operations. The resize operation itself is O(n)O(n), but since it is not performed every time we add an element, the average time taken per operation is O(1)O(1). But this is only the case if we double the size of the array when we run out of space.

### Why double the capacity?

The visual below shows a resulting array of size 88. Now imagine that we wanted to dynamically fill it up and we started with a size 11 array. We would add 55, double the space to add 66, double that space to add 77 and 88, double that space to add 99, 1010, 1111 and 1212.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/93d1f86f-ac47-469e-b2f7-9dd14435a300/sharpen=1)

The size of the above array went from `1 -> 2 -> 4 -> 8`.

To analyze the time complexity we have to take into consideration the _**sum of all the operations**_ that occured before the last one since we would not have gotten to the resulting array without these operations. To achieve an array of size 88, we would have to perform 1+2+4+8=151+2+4+8=15 operations, which includes the resize operations.

The pattern here is that the last term (the dominating term) is always greater than or equal to the sum of all the terms before it. In this case, 1+2+4=71+2+4=7, and 7<87<8. Add in the 88 to the 77, we get a total of 1515 operations to create the resulting array of size 88.

Generally, the formula is that for any array size nn, it will take at most 2n2n operations to create, which would belong to O(n)O(n).

Since inserting `n` elements into a dynamic array is O(n)O(n), the amortized time complexity of inserting a single element is O(1)O(1).

> With time complexity, we are concerned with asymptotic analysis. This means we care about how quickly the runtime grows as the input size grows. We don't distinguish between O(2n)O(2n) and O(n)O(n) because the runtime grows linearly with the input size, even if the constant is doubled.  
> With time complexity analysis, we typically drop constant terms and coefficients.

### Other Operations

Inserting or removing from the middle of a dynamic array would be similar to a static array. We would have to shift elements to the right or left to make space for the new element or to fill the gap left by the removed element. This would run in O(n)O(n) time.

---

## Time Complexity

| Operation | Big-O Time | Notes                                                               |
| --------- | ---------- | ------------------------------------------------------------------- |
| Access    | O(1)O(1)   |                                                                     |
| Insertion | O(1)∗O(1)∗ | O(n)O(n) if insertion in the middle since shifting will be required |
| Deletion  | O(1)∗O(1)∗ | O(n)O(n) if deletion in the middle since shifting will be required  |


# Stacks

A stack is a data structure that supports a subset of operations from a dynamic array. With a stack you may only add and delete elements from one end of the array (referred to as the top of the stack).

In the physical world, a stack can be conceptualized by thinking of a stack of plates. You may grab a plate from the top or you may add a plate to the top. You cannot remove or add a plate to the middle of the stack. This is the same as the stack data structure.

Stacks are a dynamic data structure that operate on a LIFO (Last In First Out) manner. The last element added to the stack is the first element that comes out. The stack supports three operations - `push`, `pop`, `peek`.

## Push

The **push** operation adds an element to the top of the stack, which in dynamic array terms would be appending an element to the end. This is an efficient O(1)O(1) operation as discussed in the previous lesson.

It helps to visualize a stack as an array that is vertical. The pseudocode demonstrates the concept, along with the visual where we add the integers 11 through 44 to the top. The top pointer updates to point at the last item added. The following pseudocode and visual demonstrates this.

```python
def push(self, n):
    # using the pushback function from dynamic arrays to add to the stack
    self.stack.append(n)
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/0e9488cb-496d-4e28-f395-83ae1f02c300/sharpen=1)

> In many languages there is no built-in stack data structure, but you can use a dynamic array to simulate a stack.

> Since a stack will remove elements in the reverse order that they were inserted in, it can be used to reverse sequences - such as a string, which is just a sequence of characters.

## Pop

The **pop** operation removes the last element from top of the stack, which in dynamic array terms would be reading and removing the last element. This is also an efficient O(1)O(1) operation as discussed previously.

```python
def pop(self):
    return self.stack.pop()
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/a4640d1e-c45e-4c36-7b3f-ae7e43cce000/sharpen=1)

> In most languages, before popping, it is a good measure to check if the stack is empty to avoid errors.

## Peek

The **peek** operation is the simplest. It simply returns, the top element without removing it. This is also an efficient O(1)O(1) operation.

```python
def peek(self):
    return self.stack[-1]
```

## Time Complexity

| Operation  | Big-O Time Complexity | Notes                             |
| ---------- | --------------------- | --------------------------------- |
| Push       | O(1)O(1)              |                                   |
| Pop        | O(1)O(1)*             | Check if the stack is empty first |
| Peek / Top | O(1)O(1)*             | Retrieves without removing        |

# Linked Lists

A linked list is another data structure that is like an array in the sense that it stores elements in an ordered sequence. But there are also some key differences.

The main difference is that linked lists are made up of objects called `ListNode`'s. This object contains two attributes:

1. `value` - This stores the value of the node. It could be a character, an integer, etc.
2. `next` - This stores the reference to the next node in the linked list. The picture below visualizes the `ListNode` object. This will make more sense a little later on.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/3616591d-ee13-4a1a-19c6-e5fb58952900/sharpen=6)

---

## Creating a Linked List from scratch

By chaining these `ListNode` objects together we can build a **linked list**. We start with a `ListNode` class:

```python
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
```

Using the `next` pointer of each, we can connect the nodes together. Suppose that we have three `ListNode` objects – `ListNode1`, `ListNode2`, `ListNode3`.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/9b99c7c9-8b41-44e1-b011-e3f2ce633100/sharpen=1)  
In this case, our value attribute is a string - red, blue, green.

> When we instantiate a list node, we don't know where it is stored in memory. The nodes likely won't be contiguous like arrays, but that isn't an issue for linked lists. The visual below gives a glimpse of how the nodes would be stored in memory.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/dd67e09c-4525-4ad1-67ac-b4fcb3ed0200/sharpen=1)

Next, we would need to make sure that our next pointers point to another `ListNode`, and not `null`. Only the last node in the linked list would have its `next` pointer point to `null`.

```python
ListNode1.next = ListNode2
```

> The address for `ListNode2` is retrieved from memory.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/eb8c55ba-5519-4f0c-9cc1-01e5a5069e00/sharpen=1)

`ListNode1`’s next pointer points to `ListNode2`. Next, we set the `next` pointer for `ListNode2` and `ListNode3`.

```python
ListNode2.next = ListNode3
ListNode3.next = null
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/0e925c41-0ca5-4e0e-7ba6-4aa2b07b2c00/sharpen=1)

---

## Traversal

To traverse a linked list from beginning to end, we can just make use of a simple while loop.

```python
cur = ListNode1
while cur:
    cur = cur.next
```

1. We start the traversal at the **head** of the list, which is `ListNode1`.
    
2. We assign it to a variable `cur`, denoting the current node we are at.
    
3. We execute the `while` loop until we reach the end of the list which is `null`.
    
4. In each iteration, we update `cur` to be the next node in the list by setting `cur = cur.next`.
    
5. The traversal runs in O(n)O(n) time where nn is the number of nodes in the linked list.
    

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/7a1a5bd7-3d4c-47c2-1281-8da922820700/sharpen=1)

### Circular Linked List

An interesting scenario presents itself if `ListNode3`’s next pointer is set to `ListNode1` instead of `null`. This results in a **circular linked list**.

Attempting to iterate through a circular linked list would result in an infinite loop. We would never reach the end of the linked list.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/b4016449-c305-4684-f861-0074a0695800/sharpen=1)

---

## Operations of a Singly Linked List

Linked Lists have a `head`, and a `tail` pointer. The `head` pointer points to the very first node in the linked list, `ListNode1`, and the `tail` pointer points to the very last node — `ListNode3`. If there is only one node in the Linked List, the `head` and the `tail` point to the same node.

### Appending

An advantage that Linked Lists have over arrays is that inserting a new element can be performed in O(1)O(1) time, even if we insert in the middle.

We do not have to shift any elements since there is no requirement for the elements to be stored contiguously in memory.

> This assumes we already have a reference to the node at the desired position we want to insert. If we have to traverse the list to arrive at the insertion point, the operation would take O(n)O(n) time.

If we wanted to append a `ListNode4` to the end of the list, we would be appending to the tail. Once `ListNode4` is appended, we update our tail pointer to be at `ListNode4`. This operation would be done in O(1)O(1) time since it is only one operation. The steps would look like the following, with code.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/e4dd25e2-2cdb-4b02-2019-1cd6e4aab900/sharpen=1)

```python
tail.next = ListNode4
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/aee8a013-fe18-4b31-8c37-770b2f265c00/sharpen=1)

```python
tail = ListNode4
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/27e84eeb-dd25-4cf9-dd30-9574f7a5f100/sharpen=1)

### Deleting from a Singly Linked List

Deleting a node from a singly linked list will take O(1)O(1) since we can accomplish this by updating a single pointer.

> This assumes we already have a reference to the node at the desired position we want to delete. If we have to traverse the list to arrive at the deletion point, the operation would take O(n)O(n) time.

Suppose we want to delete `ListNode2`. Currently, our `head` points to `ListNode1`, and `head.next` points to `ListNode2`. We can update our `head.next` pointer to `ListNode3`, which can be accessed by chaining `next` pointers like `head.next.next`. This makes sense since `head.next` is `ListNode2`, and logically, `head.next.next` would be `ListNode3`.

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/adfeff07-5e43-4fbb-d4d9-a89d48f43300/sharpen=1)

```python
head.next = head.next.next
```

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/4b5e968e-42c7-40aa-a7b9-dfeec8d7f700/sharpen=1)

Updated linked list after deletion of `ListNode2`. Notice that now `ListNode1`’s next pointer points to `ListNode3`, instead of `ListNode2`

![](https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/4b012cbc-c13e-436a-e7be-b3116525b800/sharpen=1)

> It can be assumed that the memory occupied by `ListNode2` will be cleared via garbage collection in most languages. In other languages like C, you would have to manually free the memory.

---

## Time Complexity

| Operation | Big-O Time Complexity | Note                                                                      |
| --------- | --------------------- | ------------------------------------------------------------------------- |
| Access    | O(n)O(n)              |                                                                           |
| Search    | O(n)O(n)              |                                                                           |
| Insertion | O(1)O(1)*             | Assuming you already have a reference to the node at the desired position |
| Deletion  | O(1)O(1)*             | Assuming you already have a reference to the node at the desired position |