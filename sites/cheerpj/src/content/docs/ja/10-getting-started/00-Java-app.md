---
title: Javaアプリケーションを実行する
description: デスクトップアプリをウェブアプリに変換
---

CheerpJは、ほとんど変更を加えずにブラウザでJavaアプリケーションを実行できます。このページでは、CheerpJを使用して最初のJavaアプリケーションをブラウザで実行する方法を説明します。

JavaソースコードはCheerpJを使用するために必要ありません。独自のアプリケーションを構築している場合、その.jarファイルをすでに持っているはずです。

**始めるために必要なもの：**

- Javaアプリケーションファイル。こちらの[TextDemo.jar](https://docs.oracle.com/javase/tutorialJWS/samples/uiswing/TextDemoProject/TextDemo.jar)サンプルも使用できます。
- JavaアプリをラップするHTMLファイル
- ウェブページをローカルでテストするための簡単なHTTPサーバー

## 1. プロジェクトディレクトリの作成

まず、すべてのファイルを置くプロジェクトフォルダーを作成します。Javaファイルと将来のHTMLファイルをここにコピーしてください。

```shell

mkdir directory_name

```

## 2. 基本的なHTMLファイルの作成

次に、以下の例のような基本的なHTMLファイルを作成します。CheerpJランタイム環境が統合され、初期化されていることに注意してください。この例では、HTMLファイルと`.jar`ファイルが先ほど作成したプロジェクトディレクトリにあると仮定しています。

```html title="index.html" {6, 9-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
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

代わりに、アプリケーションが`java -jar`コマンドで実行されるように設計されていない場合は、`cheerpjRunJar()`を
`cheerpjRunMain()`に置き換え、修飾クラス名を引数として渡すことができます。例えば：

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
);
```

> [!help] /app/プレフィックスを使用することを忘れないでください
> 初めてのユーザーがアプリケーションの場所をcheerpjRunJar()やcheerpjRunMain()に渡すときに、プレフィックス「/app/」を追加し忘れることがよくあります。

## 3. ページをホスト

これでhttp-serverユーティリティのようなシンプルなHTTPサーバーで、このウェブページを提供できるようになります。

```shell
npx http-server -p 8080
```

> [!tip]
> ページをディスクから直接開く（例えば、ダブルクリックする）ことはサポートされていません。

## 何が起こっているのか？

- `<head>`スクリプトがCheerpJを読み込みます。
- [`cheerpjInit`]がCheerpJランタイム環境を初期化します。
- [`cheerpjCreateDisplay`]がすべてのJavaウィンドウを含むグラフィカル環境を作成します。
- [`cheerpjRunJar`]がアプリケーションを実行します！
- `/app/`は、このページがロードされているウェブサーバーのルートを参照する[仮想ファイルシステム]マウントポイントです。

## 結果

ブラウザにCheerpJディスプレイが表示され、いくつかの読み込みメッセージの後にアプリケーションが実行されるのが見えます。アプリケーションと適用された最適化に応じて、数秒しかかからないかもしれません。

### アプリケーションが動作しない場合

以下のチェックを試してください：

- [`cheerpjRunJar`]または[`cheerpjRunMain`]に渡すときにプレフィックス`/app/`が追加されていることを確認します。詳細については[仮想ファイルシステム]ガイドを参照してください。
- JavaアプリケーションがCheerpJなしで正常に動作することを確認します。
- ページをダブルクリックで開かず、http-serverを使用していることを確認します。

## さらに読む

- [ランタイムAPIリファレンス](/docs/reference)

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjCreateDisplay`]: /docs/reference/cheerpjCreateDisplay
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[仮想ファイルシステム]: /docs/guides/File-System-support
