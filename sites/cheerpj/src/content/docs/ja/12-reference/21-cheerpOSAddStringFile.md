---
title: cheerpOSAddStringFile
description: 仮想ファイルシステムにファイルを書き込む
language: ja
---

`/str/` ファイルシステムにファイルを書き込むために使用されます。ファイルがすでに存在する場合は上書きされます。

```ts
function cheerpOSAddStringFile(path: string, data: string | Uint8Array): void;
```

## パラメーター

- **path (`string`)** - 上書きするファイルへのパス。`/str/`で始まる必要があります。
- **data (`string` or `Uint8Array`)** - テキストまたはバイナリデータとしてのファイル内容。

## 戻り値

`cheerpOSAddStringFile` は値を返しません。

## 例

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```
