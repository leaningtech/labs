---
title: ファイルとファイルシステム
description: 仮想ファイルシステムとその使用方法
language: ja
---

CheerpJのファイルシステムは、複数のマウントポイントを持つUNIXスタイルの仮想ファイルシステムとして実装されています：

| マウント  | 説明                                                                | 書き込み | 読み取り |
| --------- | ------------------------------------------------------------------- | -------- | -------- |
| `/app/`   | Webサーバーからファイルを読み込むためのHTTPベースのファイルシステム | できない | できる   |
| `/files/` | 永続的な読み書き可能なファイルシステム                              | Javaのみ | できる   |
| `/str/`   | JavaScriptの文字列またはバイナリデータをJavaに渡すファイルシステム  | JSのみ   | できる   |

![](/docs/cheerpj3/assets/filesystem.png)

> [!info] ローカルファイル
> CheerpJは仮想化されたファイルシステムへのアクセスを提供しますが、これはローカルユーザーのコンピュータとは対応していません。ブラウザのセキュリティの原因で、ローカルファイルへの直接アクセスは禁止されています。

## `/app/` マウントポイント

`/app/`マウントポイントは、仮想的な読み取り専用のHTTPベースのファイルシステムに対応しています。`/app/`は、ローカルサーバーからJARファイルやデータにアクセスするなど、さまざまな目的に使用できます。

`/app/`マウントポイントは、ウェブサーバーのルートを指します。ファイルが`/app/`から読み取られると、CheerpJはそのファイルを取得するためにHTTP(S)リクエストを行います。

`/app/`マウントポイントの概念を明確にするために、CheerpJアプリケーションを含むHTMLファイルが `http://127.0.0.1:8080/`から提供されていると仮定します:

- `/app/example.jar`は `http://127.0.0.1:8080/example.jar`と同じです。

- `/app/subdirectory/example.txt` は `http://127.0.0.1:8080/subdirectory/example.txt`と同じです。

上記の例を考えると、JARを[`cheerpjRunJar`]で実行するには、それがウェブサーバーのルートに保存されていると仮定して、次のように実行する必要があります：

```js
cheerpjRunJar("/app/my_application_archive.jar");
```

> [!tip] JARファイルの場所
> `/app/` マウントポイントは、アプリケーションのJARファイルを保存するための最も一般的な場所ですが、必須ではありません。例えば、JARファイルをJSで`/str/`に書き込み、その後それを実行することもできます。

## `/files/` マウントポイント

`/files/`マウントポイントは、仮想的な読み書き可能なIndexedDBベースのファイルシステムに対応しており、ブラウザクライアント内でデータを永続的に保存するために使用されます。

セッション間で保持されるべきデータ、例えばユーザーの設定などを保存するのに適しています。

`/files/`マウントポイントへのファイルの書き込みは、Javaアプリケーションの内部からのみ可能です。例えば：

```java
File file = new File("/files/myfile.ext");
OutputStream out = new FileOutputStream(file);
out.close();
```

> [!tip] データの永続性について
> このマウントポイントのデータは、アプリケーションを閉じて再起動した場合でも保持されます。ただし、ブラウザのデータを消去したり、「シークレットモード」でブラウザを使用したりすると、データは削除されます。この動作は、使用するブラウザや他のシナリオによって異なる場合があります。

ブラウザのデータ削除や永続性に関する詳細については、 [こちらのページ](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#when_is_data_evicted)をご覧ください。

## `/str/` マウントポイント

`/str/`マウントポイントは、JavaScriptからデータを共有するためにJavaコードと連携するシンプルなファイルシステムです。このファイルシステムは、Javaからは読み取り専用です。

### JavaScriptでファイルを書き込む

JavaScriptからは、[`cheerpOSAddStringFile`]APIを使用してファイルシステムにファイルを追加することができます。例：

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```

その後、Javaからこのデータにアクセスできます。例えば：

```java

import java.io.FileReader;

...
FileReader f = new FileReader("/str/fileName.txt")
...

```

`cheerpOSAddStringFile`APIは、JavaScriptの`String`や`Uint8Array`と一緒に使用できます。`Uint8Array`は、Javaアプリケーションにバイナリデータを提供する際に役立ちます。例えば、HTML5の`<input type="file">`タグから選択されたファイルなどです。

## JavaScriptでファイルを読み取る

JavaScriptを使用して任意のマウントポイントからファイルを読み取るには、次のように[`cjFileBlob`]APIを使用します:

```js
const blob = await cjFileBlob("/files/myfile.ext");
const text = await blob.text();
console.log(text);
```

[`cjFileBlob`]: /docs/ja/reference/cjFileBlob
[`cheerpjRunJar`]: /docs/ja/reference/cheerpjRunJar
[`cheerpOSAddStringFile`]: /docs/ja/reference/cheerpOSAddStringFile
