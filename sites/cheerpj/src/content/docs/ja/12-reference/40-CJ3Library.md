---
title: CJ3Library
description: ライブラリモードセッション
---

このクラスは、[ライブラリモード](/docs/guides/library-mode) セッションを表します。ロードされたライブラリのクラスやメソッドにアクセスするために使用できます。

インスタンスは以下の方法で取得できます:

- [`cheerpjRunLibrary`]を呼び出して、JARからライブラリをロードする。
- [ネイティブメソッド](/docs/guides/Implementing-Java-native-methods-in-JavaScript)を実装する。 - 最初のパラメータはCJ3Libraryインスタンスです。

## 使用方法

- クラスをロードするには、それにアクセスし、`await`します。
- 静的メソッドを呼び出すには、ロードされたクラスのメソッドとして呼び出し、`await`します。
- クラスをインスタンスに構築するには、`await new`を使用します。
- インスタンスメソッドを呼び出すには、ロードされたクラスのインスタンスのメソッドとして呼び出し、`await`します。
- パブリックフィールドの読み取り/書き込みは通常どおり行います。
- `instanceof` がサポートされています。

## 変換ルール

型変換は、[LiveConnect仕様書](https://web.archive.org/web/20110204185537/http://jdk6.java.net/plugin2/liveconnect/#JS_JAVA_CONVERSIONS)に準拠しています。いくつかの拡張があります:

| JavaScript 型 | Java 型                      | 備考             |
| --------------- | ------------------------------ | ---------------- |
| `Int8Array`     | `byte[]`                       | 参照渡し     |
| `Uint16Array`   | `char[]`                       | 参照渡し     |
| `Int16Array`    | `short[]`                      | 参照渡し     |
| `Uint8Array`    | `boolean[]`                    | 参照渡し     |
| `Int32Array`    | `int[]`                        | 参照渡し     |
| `BigInt64Array` | `long[]`                       | 参照渡し     |
| `Float32Array`  | `float[]`                      | 参照渡し     |
| `Float64Array`  | `double[]`                     | 参照渡し     |
| `any`           | `netscape.javascript.JSObject` | 不透明な参照 |

その他の型については、LiveConnect仕様書を参照してください。

## `CJ3Library#getJNIDataView`

```ts
class CJ3Library {
	getJNIDataView(): DataView;
}
```

ライブラリの生のJNIメモリの`DataView` を返します。

[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
