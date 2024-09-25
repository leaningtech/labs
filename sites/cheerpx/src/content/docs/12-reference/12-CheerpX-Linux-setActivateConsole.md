---
title: CheerpX.Linux#setActivateConsole
description: Manage virtual terminal switching within CheerpX
---

```ts
namespace CheerpX {
	class Linux {
		setActivateConsole(callback: (idx: number) => void): (idx: number) => void;
	}
}
```

## Parameters

- **callback (`((idx: number) => void)`)** - A function that gets called with the index `(idx)` of the virtual terminal that needs activation.

## Returns

`setActivateConsole` returns a function of type `(idx: number) => void`. This returned function should be called to complete the virtual terminal activation process.

## Examples

```js
const cx = await CheerpX.Linux.create(/* ... */);

const cxActivateFunc = cx.setActivateConsole((idx) => {
	activateVt(idx);
});

const activateVt = (idx) => {
	// Perform any additional front-end logic
	// ...
	// Call the function returned by setActivateConsole to complete the activation
	cxActivateFunc(idx);
};
```
