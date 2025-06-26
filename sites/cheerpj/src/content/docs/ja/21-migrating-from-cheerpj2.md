---
title: CheerpJ 2からの移行
language: ja
---

CheerpJ 3はCheerpJ 2の完全な再実装であり、そのため後方互換性はありません。

## スクリプトタグ

CheerpJ 4をページに含めるには、以下のコードを使用してください：

```html
<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
```

## 互換性の破壊的変更

新しいアーキテクチャを設計する際、私たちの目標はCheerpJ 2.3を可能な限り置き換えることでした。この目標は*ほぼ*達成されたが、一部のケースでは、機能を廃止し、より優れた代替案に置き換える必要がありました。

### `cheerpjInit` は非同期になりました

ランタイムAPIは、[`cheerpjInit`]が呼び出され、その `Promise` が解決されるまで公開されません。

したがって、**他の関数を使用する前に必ず**[`cheerpjInit`]を`await`してください。

### `cheerpj-dom.jar` の削除

JavaからJavaScript関数を呼び出すには、`cheerpjInit`の`natives` オプションを使用するようになりました。詳細については、[JNIガイド]を参照してください。

`com.leaningtech.client` パッケージを広範に使用していた場合は、[CJDomライブラリ](https://github.com/reportmill/CJDom)（Leaning Technologiesによって管理されていません）をチェックしてください。

### `cheerpjRunJarWithClasspath` の削除

`java -jar`を使用する場合、JARファイルがすべてのユーザークラスのソースであり、他のクラスパス設定は無視されるため、この機能には実際の使用例がありませんでした。

### `CheerpJWorker` の置き換え

CheerpJは、特別な設定なしでWeb Workerにインポートできるようになりました。単にワーカーから[`importScripts`](https://developer.mozilla.org/ja/docs/Web/API/WorkerGlobalScope/importScripts) を呼び出してCheerpJをロードし、通常通りCheerpJを使用してください。`CheerpJWorker` クラスは削除されました。

```js
importScripts("https://cjrtnc.leaningtech.com/4.2/loader.js");

// 通常通りCheerpJを使用
(async () => {
  await cheerpjInit();
  const lib = await cheerpjRunLibrary("/app/example.jar");
  // ...
)();
```

### `cjNew` および `cjCall` のライブラリモードAPIへの置き換え

`cjNew` および `cjCall` は、[`cheerpjRunLibrary`]に置き換えられました。

```js
// CheerpJ 2
cheerpjInit();
cheerpjRunJar("/app/library.jar");
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");
```

```js
// CheerpJ 3
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await lib.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## その他の主要な変更点

<!-- TODO: copy from cheerpj-3-deep-dive blog post -->

### 事前コンパイル(`cheerpjify.py`)の廃止

**事前コンパイルなし:** CheerpJ 2.3では、良いパフォーマンスを得るために、JARファイルをカスタムバイナリコンパイラで後処理する必要がありました。コンパイラは各入力JARに対して`.jar.js` ファイルを生成していました。CheerpJ 3では、以前のバージョンよりも優れたパフォーマンスを発揮する高度なJITエンジンを搭載しています。`.jar.js` ファイルの削除により、アプリケーションの起動時にダウンロードが必要なデータ量が大幅に減少することができます。

CheerpJ 3ではダウンロードは提供されません。

- AOT最適化: CheerpJ 3はJITコンパイラのみを使用し、そのため、JARファイルの前処理（例:`.jar.js`への変換）は不要です。
- `--natives`: JNI関数の実装は、`natives`オプションを使用して`cheerpjInit` に渡す必要があります。詳細については、[JNIガイド]をご覧ください。

### ClassLoaderの正式サポート

CheerpJ 2.3ではClassLoaderのサポートが非常に限られていました。 `.jar.js`ファイルの事前コンパイルが必要であったため、OpenJDKによって提供される標準のクラスローダーのみがサポートされていました。CheerpJ 3.0では、Javaが期待する通りにクラスローダーを適切に使用することで、この状況を大幅に改善しています。

### `com.leaningtech.handlers` HTTPハンドラーは不要に

以前のCheerpJ 2では、HTTP(S)リクエストを機能させるために特別なJavaプロパティを設定する必要がありましたが、これはもう必要ありません。

### `cheerpjAddStringFile`の廃止と`cheerpOSAddStringFile`への名前変更

`cheerpjAddStringFile` 関数は、その動作をより適切に反映し、CheerpXと統一するために`cheerpOSAddStringFile`に名前が変更されました。旧名は後方互換性のために引き続き使用可能です。

[`cheerpjInit`]: /docs/ja/reference/cheerpjInit
[`cheerpjRunLibrary`]: /docs/ja/reference/cheerpjRunLibrary
[`cheerpjRunMain`]: /docs/ja/reference/cheerpjRunMain
[JNIガイド]: /docs/ja/guides/Implementing-Java-native-methods-in-JavaScript
