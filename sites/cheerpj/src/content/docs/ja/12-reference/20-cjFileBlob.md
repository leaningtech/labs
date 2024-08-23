---
title: cjFileBlob
description: 仮想ファイルシステムからファイルを読み取る
---

CheerpJ仮想ファイルシステムからファイルを読み取るために使用されます。

```ts
async function cjFileBlob(path: string): Promise<Blob>;
```

## パラメーター

- **path (`string`)** - 読み取るファイルへのパス。 `/files/`、`/app/` 、または`/str/`で始まる必要があります。

## 戻り値

`cjFileBlob`は、ファイル内容の[Blob] に解決される[Promise] を返します。

## 例

### テキストファイルの読み取り

```js
const blob = await cjFileBlob("/files/file1.txt");
const text = await blob.text();
console.log(text);
```

### バイナリファイルの読み取り

```js
const blob = await cjFileBlob("/files/file2.bin");
const data = new Uint8Array(await blob.arrayBuffer());
console.log(data);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
