# `@suchipi/tracker`

Standalone Reactive tracker, like [Meteor's `Tracker`](https://docs.meteor.com/api/tracker.html).

Less than 1KiB gzipped.

## Installation

```sh
npm install --save @suchipi/tracker
```

## Sample usage

```ts
import { autorun, ReactiveVar } from "@suchipi/tracker";

const points = new ReactiveVar(0);

autorun(() => {
  // Because this function calls `points.get`, it will automatically be
  // re-run whenever `points.set` is called.
  console.log(`Score: ${points.get()}`);
});

points.set(1); // Logs "Score: 1"
points.set(45); // Logs "Score: 45"
points.set(0); // Logs "Score: 0"
```

## API

### `autorun`

Runs its received function now, and also registers it to be re-run in the future if any `Dependency` objects accessed during the function run get changed.

```ts
import { autorun } from "@suchipi/tracker";

Tracker.autorun(() => {
  // your code that uses Dependency objects goes here
});
```

### `Dependency`

Used to represent a value or resource that can be changed. When it changes, any functions that accessed it during a `Tracker.autorun` call will be automatically re-run.

```ts
import { Dependency } from "@suchipi/tracker";

const dep = new Dependency();

// When something is reading from the value/resource, call:
dep.depend();

// When something has updated the value/resource, call:
dep.changed();
```

### `ReactiveVar`

An object that holds a current value and creates a `Dependency` to track it. When the value is changed, the `Dependency`'s `changed` method is called.

```ts
import { ReactiveVar } from "@suchipi/tracker";

const myVar = new ReactiveVar<number>(42);

myVar.get(); // 42
myVar.set(45);
myVar.get(); // 45
```
