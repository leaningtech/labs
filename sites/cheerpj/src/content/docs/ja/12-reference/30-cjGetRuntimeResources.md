---
title: cjGetRuntimeResources
description: 読み込まれたリソースの一覧を取得する
language: ja
---

この関数は、[preloadResources]に渡すデータを表すJavaScript文字列を返します。この関数が呼び出された時点までにランタイムから読み込まれたファイル名を含むオブジェクトになります。

詳細については、[起動時間の最適化](/docs/ja/guides/Startup-time-optimization) を参照してください。

```ts
function cjGetRuntimeResources(): string;
```

> [!note] 注意
> この関数はブラウザコンソールでの使用を意図しています。アプリケーション内から呼び出すことは想定されていません。

## パラメーター

`cjGetRuntimeResources` はパラメーターを受け取りません。

## 戻り値

`cjGetRuntimeResources` は、ランタイムから読み込まれたファイルを表す文字列を返します。

この文字列を[JSON.parse]で解析し、次回以降のページ読み込み時に[preloadResources]として渡します。

## 例

ブラウザのコンソールで次のように入力します:

```shell
cjGetRuntimeResources();
```

出力は次のようになります:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```

[preloadResources]: /docs/ja/reference/cheerpjInit#preloadresources
[JSON.parse]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
