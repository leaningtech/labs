---
title: Javaライブラリの実行
description: JavaScriptでJavaクラスを使用する
---

## 1. ページにCheerpJを含める

```html
<script src="https://cjrtnc.leaningtech.com/4.1/loader.js"></script>
```

## 2. CheerpJを初期化し、Javaライブラリを読み込む

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
```

> [!help] /app/ プレフィックスの使用を忘れないでください
> 初めてのユーザーがJARの場所をcheerpJRunLibrary()に渡す際に「/app/」プレフィックスを追加するのを忘れることがよくあります。

これにより、ウェブサーバーのルートから `library.jar` が読み込まれます。

## 3. JavaScriptからJavaを呼び出す

```js
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## さらに読む

- [`cheerpjRunLibrary` リファレンス](/docs/ja/reference/cheerpjRunLibrary)
