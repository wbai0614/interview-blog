<!--
title: Python: Asynchronous Programming
tags: python, async, concurrency, interview
description: Introduction to Python async/await, asyncio, and concurrent programming concepts.
featured: false
-->

# Python: Asynchronous Programming

Asynchronous programming in Python allows you to write **non-blocking code** for I/O-bound operations, improving performance in concurrent scenarios.

## async / await

- `async` defines a coroutine  
- `await` pauses coroutine until awaited task completes  

```python
import asyncio

async def say_hello():
    await asyncio.sleep(1)
    print("Hello")

async def main():
    await asyncio.gather(say_hello(), say_hello())

asyncio.run(main())
