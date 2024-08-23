---
title: cheerpjRunLibrary
description: Javaライブラリをロードする
---

JavaScriptで使用するためにJavaライブラリをロードします。詳細については[ライブラリモード](/docs/guides/library-mode)を参照してください。

```ts
async function cheerpjRunLibrary(classPath: string): Promise<CJ3Library>;
```

## パラメーター

- **classPath (`string`)** - [仮想ファイルシステム]内のライブラリのjarファイルへのパス。標準ライブラリのみをロードする場合は空の文字列を渡します。

## 戻り値

`cheerpjRunLibrary` は、[CJ3Library]オブジェクトに解決される[Promise] を返します。

## 例

### 標準ライブラリの使用

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("");

const System = await lib.java.lang.System;
await System.out.println("Hello from Java");
```

### カスタムライブラリの使用

以下のクラスからコンパイルされた `example.jar`というライブラリがあるとします:

```java
package com.example;

public class Example {
  public String[] greetings = {"Hello", "Bye"};
  public void hello() {
    System.out.println("Example says hello!");
  }
}
```

`example.jar` がウェブサーバーの`/example.jar`にある場合、次のように使用できます：

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/example.jar");

const Example = await lib.com.example.Example;
const example = await new Example();
await example.hello(); // Example says hello!
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[仮想ファイルシステム]: /docs/guides/File-System-support
[CJ3Library]: /docs/reference/CJ3Library
