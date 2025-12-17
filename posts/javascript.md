<!-- tags: javascript, coding, interview -->

# JavaScript Closures

- Closures are functions with access to outer scope variables.
- Useful for private variables and callbacks.

```javascript
function makeCounter() {
  let count = 0;
  return function() { return ++count; }
}
const counter = makeCounter();
console.log(counter()); // 1
