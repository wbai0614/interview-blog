<!-- tags: python, async, coding -->

# Python Asyncio

- Asynchronous programming for I/O bound tasks  
- `async` and `await` keywords  
- Event loop executes coroutines

```python
import asyncio

async def main():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

asyncio.run(main())
