---
title: cheerpjCreateDisplay
description: GUI要素の表示
---

`cheerpjCreateDisplay` は、グラフィカルレンダリングに使用される要素をDOMに追加します。

```ts
function cheerpjCreateDisplay(
	width: number,
	height: number,
	parent?: HTMLElement,
): HTMLElement;
```

## パラメーター

- **width (`number`)** - 表示エリアの幅をCSSピクセル単位で指定します。親の幅に合わせる場合は`-1` を指定します。
- **height (`number`)** - 表示エリアの高さをCSSピクセル単位で指定します。親の高さに合わせる場合は`-1` を指定します。
- **parent (`HTMLElement`, _optional_ )** - 表示エリアを子要素として追加する親要素を指定します。

## 戻り値

`cheerpjCreateDisplay` は、作成された表示エリアを表す[`HTMLElement`] を返します。

## 例

### 表示エリアの作成

```js
cheerpjCreateDisplay(800, 600);
```

これにより、800x600の表示エリアが作成され、ドキュメントのボディに追加されます。

### ページ全体の使用

```js
cheerpjCreateDisplay(-1, -1, document.body);
```

これにより、ページ全体を占有し、ページサイズの変更に対応する表示エリアが作成されます。

### Reactでの使用例

```jsx
import { useRef, useEffect } from "react";

function Display({ width, height }) {
	const parent = useRef();
	useEffect(() => {
		cheerpjCreateDisplay(width, height, parent);
	});
	return <div ref={parent} />;
}
```

[`HTMLElement`]: https://developer.mozilla.org/ja/docs/Web/API/HTMLElement
