---
title: cheerpjRunMain
description: Javaクラスの静的mainメソッドを実行してアプリケーションを起動します
---

```ts
async function cheerpjRunMain(
	className: string,
	classPath: string,
	...args: string[]
): Promise<number>;
```

## パラメーター

- **className (`string`)** - 実行する静的mainメソッドを持つクラスの完全修飾名。例えば、 `com.application.MyClassName`。
- **classPath (`string`)** - [仮想ファイルシステム]におけるクラスのjarの場所。`:`で区切られた依存関係。
- **..args (`string[]`, _optional_ )** - mainメソッドに渡す引数。

## 戻り値

`cheerpjRunMain`は、プログラムの[終了ステータス]で解決される[Promise]を返します。`0`は成功を示し、それ以外の値は失敗を示します。

## 例

```js
const exitCode = await cheerpjRunMain(
	"fully.qualified.ClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2
);
console.log(`Program exited with code ${exitCode}`);
```

[Promise]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise
[終了ステータス]: https://ja.wikipedia.org/wiki/終了ステータス
[仮想ファイルシステム]: /docs/ja/guides/File-System-support
