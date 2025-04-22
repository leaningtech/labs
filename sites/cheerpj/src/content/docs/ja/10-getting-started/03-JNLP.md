---
title: JNLPの実行
description: ブラウザでJWS/JNLPアプリケーションを実行する
---

このクイックスタートチュートリアルでは、ブラウザでCheerpJを使用してJNLPアプリ（Java Web Startアプリケーションとしても知られています）を実行する手順を説明します。

Java Web Startアプリケーションを実行するためのすぐに使えるツールに興味がある場合は、[CheerpJ JNLP Runner](/cheerpj-jnlp-runner) ブラウザ拡張機能をご覧ください。

必要なもの：

- アプリケーションの`.jnlp` ファイル。
- JavaアプリをラップするHTMLファイル。
- ウェブページをローカルでテストするための簡単なHTTPサーバー。

## 1. `.jnlp` ファイル

`.jnlp`ファイルには、Javaアプリケーションを起動するための詳細が記載されています。 通常のパイプラインは、このファイルがウェブサイトからトリガーされ、ユーザーのローカルJNLPクライアントに渡され、アプリケーションの`.jar`ファイルやその他のリソースがダウンロードされるところから始まります。最終的に、アプリはローカルのJREインストールで実行されます。 **CheerpJを使用すると、このアプリケーションをブラウザのサンドボックス内で実行でき、Javaのインストールは不要です。**

`.jnlp`ファイルは、以下の例のような形式になっているかもしれません。次の3つの重要な要素を見つける必要があります:

1. `<resources>`要素の下で指定された`.jar`ファイル、通常は`<jar>`または`<nativelib>`タグで示されています。
2. アプリケーションの種類。`<application-desc>`または`<applet-desc>`タグを探してください。
3. `<jnlp>`で指定された`codebase` URLが必要になる場合があります。

```xml title="example.jnlp" {5, 22-23, 26}
<?xml version="1.0" encoding="utf-8"?>
<!-- JNLP Example -->
<jnlp
  spec="1.0+"
  codebase="code-base-url"
  href="example.jnlp">
  <information>
    <title>Your application name</title>
    <vendor>Vendor name</vendor>
    <homepage href="home-page-url"/>
    <description>Description of your Java application</description>
    <description kind="short">Another description of your Java application</description>
    <icon href="image-url"/>
    <icon kind="icon-name" href="image-url"/>
    <offline-allowed/>
  </information>
  <security>
      <all-permissions/>
  </security>
  <resources>
    <j2se version="1.4+" initial-heap-size="64m" max-heap-size="640m"/>
    <jar href="my_application_archive.jar"/>
    <jar href="lib/my_dependency.jar"/>
    <property name="key" value="overwritten"/>
  </resources>
  <application-desc main-class="com.application.MyClassName"/>
</jnlp>
```

## 2. プロジェクトディレクトリを作成する

`<jar>`または`<nativelib>`タグの場所をJNLPファイル内で確認したら、ブラウザのナビゲーションバーにURLをコピー、ペーストすることでダウンロードできます。これらのURLが相対パスの場合は、`codebase` URLに`jar` URLを追加して完全なURLを構築してください：

例えば:

```
code-base-url/my_application_archive.jar
code-base-url/lib/my_dependency.jar
```

プロジェクト用のディレクトリを作成し、先ほどダウンロードしたJARファイルをこのフォルダ内に配置してください。`.jnlp`に示されているのと同じディレクトリ構造を維持することを忘れないでください。

例えば:

```shell
mkdir -p directory_name/lib
```

JARファイルを移動すると、次のようになるはずです:

```
└── directory_name
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

## 3. 基本的なHTMLファイルを作成する

### 3.1 アプリケーションの種類を特定する

JNLPアプリは、**スタンドアロンアプリケーション**または**アプレット**のいずれかです。これは、`.jnlp`ファイル内
の **`<application-desc>`** または **`<applet-desc>`** タグで簡単に確認できます。

CheerpJランタイムが統合され、Javaアプリケーションが表示される基本的なHTMLファイルを作成します。このファイルをプロジェクトフォルダのルートに作成してください。アプリケーションがスタンドアロンアプリかアプレットかによって、アプリの読み込み方法が異なる場合があります。次の手順では、それぞれの場合におけるHTMLの構造について説明します。

### 3.2 アプリケーションがスタンドアロンアプリの場合

`<application-desc>`の内容をよく確認し、以下の点を把握しておいてください:

- **アプリケーションクラス名:** これは`main-class`属性にあります。この属性がない場合は、クラス名がマニフェストに含まれている可能性があります。
- **アプリケーション引数:** 引数が必要な場合、これらは`<argument>`タグで見つけることができます。

> [!note] ご注意
> 上記の要素が見つからない場合は、アプリケーションを実行するためにこれらの要素は必要ないことを意味します。

クラス名がマニフェストに含まれているアプリのHTMLファイルの例:

```html title = "index.html" {6, 9-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			(async function () {
				await cheerpjInit();
				cheerpjCreateDisplay(800, 600);
				await cheerpjRunJar("/app/my_application_archive.jar");
			})();
		</script>
	</body>
</html>
```

また、クラス名が`.jnlp`ファイルにあり、マニフェストにはない場合は、[`cheerpjRunJar()`]を[`cheerpjRunMain()`]に置き換えてください：

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/lib/my_dependency_archive.jar"
);
```

アプリケーションの引数がある場合は、[`cheerpjRunJar()`]または[`cheerpjRunMain()`]に渡す必要があります。
`/app/`プレフィックスは、このページがロードされているウェブサーバーのルートを参照する仮想ファイルシステムのマウントポイントです。

### 3.2 アプリケーションがアプレットの場合

`.jnlp`ファイルの`<applet-desc>`タグをよく確認し、以下の点を把握しておいてください:

- **アプレットタグのパラメーター:**

  - **アプレットクラス名:** `main-class` 属性に記載されています。
  - **アプレットの理想的なサイズ:** `width` および`height`属性で定義されています。
  - **アプレットパラメーター:** アプレットがそれを必要とする場合、`<applet-desc>`内の `<param>`タグとして見つけることができます。

- **documentBase:** このURLを取得すると、アプレットがラップされているHTMLファイルが得られます。これを使用するか、以下の例のように独自のHTMLを作成することもできます。`documentBase`のHTMLファイルを使用する場合は、CheerpJランタイムが統合され、呼び出されるスクリプトを追加することを忘れないでください。

アプレット用のHTMLは次のようになります:

```html title="index.html" {6, 9-17}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ applet test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<applet
			archive="my_applet_archive.jar"
			code="com.applet.MyClassName"
			height="900"
			width="900"
		></applet>
		<script>
			cheerpjInit();
		</script>
	</body>
</html>
```

アプレットのパラメーターは、通常通り`<applet>`タグ内の`<param>`として渡す必要があります。

```html {7}
<applet
	archive="my_applet_archive.jar"
	code="com.applet.MyClassName"
	height="900"
	width="900"
>
	<param name="paramName" value="paramValue" />
</applet>
```

> ユーザーがネイティブのJavaプラグインをインストールしている場合、元のHTMLタグを　`cheerpj-`　プレフィックス付きのバージョンに置き換えることができます。`<cheerpj-applet>`, `<cheerpj-object>`および`<cheerpj-embed>` がすべてサポートされています。

## 4. ページをホストする

最終的なプロジェクトディレクトリの構成は、以下のようになります：

```
└── directory_name
    ├── index.html
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

これで、プロジェクトディレクトリに移動し、http-serverユーティリティのようなシンプルなHTTPサーバーでこのウェブページを提供することができます。

```sh
cd directory_name
npm install http-server
http-server -p 8080
```

## 終わり

これでこのチュートリアルは終了です。CheerpJを使用してスタンドアロンアプリケーションやアプレットを実行する方法について詳しく学びたい場合は、専用のチュートリアルをご覧ください：

<div class="not-prose grid grid-cols-2 font-medium gap-2 text-stone-100">
	<a
		href="/docs/ja/getting-started/Java-app"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		アプリケーション
	</a>
	<a
		href="/docs/ja/getting-started/Java-applet"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		アプレット
	</a>
</div>

[`cheerpjRunJar()`]: /docs/ja/reference/cheerpjRunJar
[`cheerpjRunMain()`]: /docs/ja/reference/cheerpjRunMain
