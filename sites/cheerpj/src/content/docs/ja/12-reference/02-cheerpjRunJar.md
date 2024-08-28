---
title: cheerpjRunJar
description: JARのメインクラスを実行する
---

```ts
async function cheerpjRunJar(
	jarName: string,
	...args: string[]
): Promise<number>;
```

## パラメーター

- **jarName (`string`)** - [仮想ファイルシステム]内のjarの場所。
- **..args (`string[]`, _optional_ )** - mainメソッドに渡す引数。

## 戻り値

`cheerpjRunJar` は、プログラムの[終了ステータス]で解決される[Promise]を返します。`0`は成功を示し、それ以外の値は失敗を示します。

## 例

### 基本的な使用法

```js
const exitCode = await cheerpjRunJar("/app/application.jar");
console.log(`Program exited with code ${exitCode}`);
```

### コマンドライン引数

```js
await cheerpjRunJar("/app/application.jar", ["--version"]);
```

[Promise]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise
[終了ステータス]: https://ja.wikipedia.org/wiki/終了ステータス
[仮想ファイルシステム]: /docs/ja/guides/File-System-support
