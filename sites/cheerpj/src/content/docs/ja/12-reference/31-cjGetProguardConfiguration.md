---
title: cjGetProguardConfiguration
description: ProGuard設定ファイルをダウンロードする
language: ja
---

これは設定ファイルのダウンロードをトリガーし、[ProGuard]を使用してJARファイルをツリーシェイク（tree shaking）するために使用できます。

```ts
function cjGetProguardConfiguration(): void;
```

> [!note] 注意
> この関数はブラウザコンソールでの使用を意図しています。アプリケーション内から呼び出すことは想定されていません。

## パラメーター

`cjGetProguardConfiguration` はパラメーターを受け取りません。

## 戻り値

`cjGetProguardConfiguration` は値を返しませんが、ファイルのダウンロードがトリガーされます。

## 例

ブラウザのコンソールで次のように入力します:

```shell
cjGetProguardConfiguration();
```

これにより、 `cheerpj.pro` ファイルのダウンロードがトリガーされます。

[ProGuard]: https://github.com/Guardsquare/proguard
