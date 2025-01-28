---
title: cheerpjInit
description: CheerpJランタイム環境の設定と初期化
---

`cheerpjInit`は、CheerpJランタイム環境を設定と初期化するためにページで一度呼び出される必要があります。

```ts
async function cheerpjInit(options?: {
	version?: number;
	status?: "splash" | "none" | "default";
	logCanvasUpdates?: boolean;
	preloadResources?: { [key: string]: number[] };
	preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
	clipboardMode?: "permission" | "system" | "java";
	beepCallback?: () => void;
	enableInputMethods?: boolean;
	overrideShortcuts?: (evt: KeyboardEvent) => boolean;
	appletParamFilter?: (originalName: string, paramValue: string) => string;
	natives?: { [method: string]: Function };
	overrideDocumentBase?: string;
	javaProperties?: string[];
	tailscaleControlUrl?: string;
	tailscaleDnsIp?: string;
	tailscaleAuthKey?: string;
	tailscaleLoginUrlCb?: (url: string) => void;
	tailscaleIpCb?: (ip: string) => void;
	licenseKey?: string;
}): Promise<void>;
```

## パラメーター

- **options (`object`, _optional_ )** - CheerpJランタイム環境のさまざまな設定を`{ option: "value" }`の形式で指定するために使用されます。

## 戻り値

`cheerpjInit` は、CheerpJの実行環境が使用可能になったときに解決される[Promise]を返します。

## オプション

`cheerpjInit()` の各オプションの説明と簡単な例を以下に示します。

### `version`

```ts
version?: number;
```

使用するJavaランタイムバージョンを指定します。現在サポートされている値は`8` のみです。

### `status`

```ts
status?: "splash" | "none" | "default";

```

このオプションは、CheerpJがステータス更新を報告する際の詳細度を決定します。

- `"default"`: 初期化中のステータス報告と、新しいランタイムコードがダウンロードされるたびに短時間表示される「Loading...」メッセージを有効にします。
- `"splash"`: 初期化中のみステータス報告を有効にします。最初のウィンドウが画面に表示された後はフィードバックがありません。
- `"none"`: すべてのステータス報告を無効にします。

例:

```js
cheerpjInit({ status: "splash" });
```

### `logCanvasUpdates`

```ts
logCanvasUpdates?: boolean;
```

`true`に設定すると、更新されている表示エリアに関するログをコンソールに出力します。オーバードローイングをデバッグする際に役立ちます。

例:

```js
cheerpjInit({ logCanvasUpdates: true });
```

### `preloadResources`<a name="preloadResources"></a>

```ts
preloadResources?: { [key: string]: number[] };
```

`preloadResources`を使用することで、特定のアプリケーションに必要となるランタイムファイルのリストをCheerpJに提供できます。このリストは、文字列のJavaScript配列として指定する必要があります。

例:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

こちらの[cjGetRuntimeResources]も参照してください。

### `preloadProgress`<a name="preloadProgress"></a>

```ts
preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
```

このコールバックは [`preloadResources`](#preloadresources)と組み合わせて使用することで、アプリケーションの読み込みを監視できます。 提供される情報は、たとえば、ロード/進行状況バーを表示するのに役立ちます。

例:

```js
function showPreloadProgress(preloadDone, preloadTotal) {
	console.log("Percentage loaded " + (preloadDone * 100) / preloadTotal);
}

await cheerpjInit({ preloadProgress: showPreloadProgress });
```

### `clipboardMode`

```ts
clipboardMode?: "permission" | "system" | "java";
```

このオプションを使用すると、クリップボードの動作を設定できます。サポートされているクリップボードモードは、[`java`]、[`system`] 、および [`permission`]です。

例:

```js
cheerpjInit({ clipboardMode: "system" });
```

#### `java` モード

これはデフォルト設定です。CheerpJは、Javaアプリケーション内でローカルに使用される内部クリップボードをサポートしており、システムクリップボードとは統合されていません。

#### `system` モード

`system` モードでは、CheerpJはシステムとクリップボードを共有します。 ただし、ブラウザではシステムクリップボードへのアクセスに厳しい制限があります。実際には、通常 `Ctrl+C` および `Ctrl+V` ショートカット（MacOSXでは`Cmd+C` および `Cmd+V`）が使用された場合にアクセスできます。この制限により、`clipboardMode:"system"` を使用する際のUX（ユーザーエクスペリエンス）は次のようになります：

- `Ctrl+C`/`Cmd+C`: ユーザーは、システムクリップボードへのアクセスを許可するためにショートカットを2回押す必要があります。2回目の`Ctrl+C`を待機している間、CheerpJは実行をブロックします。
- `Ctrl+V`/`Cmd+V`: このショートカットは通常通り動作し、ネイティブ実行との違いはありません。
- メニュー構造に基づいたコピー/ペースト: クリップボードにアクセスするには `Ctrl+C`/`Ctrl+V` が必要です。適切なショートカットを待機している間、CheerpJは実行をブロックします。

#### `permission` モード

`permission` モードを有効にすると、CheerpJは`system`モードよりもシームレスな統合を提供します。このモードでは、プレーンテキストに加えて画像やHTMLのサポートも含まれます。 もう一つの重要な特徴は、コピー＆ペースト操作を行う際に、2回目に`Ctrl+C`/`Ctrl+V` を押す必要がありません。

最初に操作が要求されたときに、ユーザーにクリップボードの使用許可が求められます。この許可が拒否された場合、続行するためにこの許可が必要であることを説明するメッセージが表示されます。

> このモードは実験的であり、一部のブラウザではいくつかの不一致が発生する場合があります。 [`詳細はこちら`](https://caniuse.com/mdn-api_permissions_permission_clipboard-read).

### `beepCallback`

```ts
beepCallback?: () => void;
```

このコールバックは、Javaで `java.awt.Toolkit.getDefaultToolkit().beep()` が呼び出されたときに実行され、システムの _ビープ音_ に対応します。

使用例:

```js
cheerpjInit({
	beepCallback: function () {
		alert("Beep!");
	},
});
```

### `enableInputMethods`

```ts
enableInputMethods?: boolean;
```

このオプションが`true` に設定されると、CheerpJはプラットフォームの入力メソッドフレームワークからのテキスト入力を受け取ることができます。これは、中国語、日本語、韓国語などの言語のテキスト入力をサポートするのに便利です。

```js
cheerpjInit({ enableInputMethods: true });
```

### `overrideShortcuts`

```ts
overrideShortcuts?: (evt: KeyboardEvent) => boolean;
```

一部のアプリケーションでは、ブラウザでも使用されているキーボードショートカット（例えば、Ctrl+F）を内部で処理する必要があります。ほとんどのユーザーは、これらのショートカットに対して標準的なブラウザの動作を期待しており、CheerpJはデフォルトではそれらを上書きしません。

CheerpJでコンパイルされたアプリケーションは、`cheerpjInit`の `overrideShortcuts`オプションとしてコールバック関数を提供することで、追加のショートカットをコントロールできます。このコールバックはブラウザからの`KeyboardEvent` を受け取り、ブラウザのデフォルトの動作を防ぐ必要がある場合は`true`を返します。

可能な限り、一貫したユーザー体験を維持するために、ブラウザ予約済みのショートカットは _使用しない_ ことをお勧めします。いずれの場合も、以下の制限が適用されます：

- 一部のショートカット（Ctrl+T、Ctrl+N、Ctrl+W）はブラウザに予約されており、ページ自体で受け取ることはできません。これらは _上書きできません_ 。-（Ctrl+C/Ctrl+V）を上書きすると、`clipboardMode:"system"` が正しく機能しなくなります。

例:

```js
cheerpjInit({
	overrideShortcuts: function (e) {
		// Let Java handle Ctrl+F
		if (e.ctrlKey && e.keyCode == 70) return true;
		return false;
	},
});
```

### `appletParamFilter`

```ts
appletParamFilter?: (originalName: string, paramValue: string) => string;
```

一部のアプリケーションでは、アプレット内にパラメーターを渡す前に、そのパラメーターを変更する必要がある場合があります。

例:

```js
cheerpjInit({
	appletParamFilter: function (name, value) {
		if (name === "httpServer") return value.replace("http", "https");
		return value;
	},
});
```

### `natives`

```ts
natives?: { [method: string]: Function };
```

このオプションは、AOTコンパイルされた言語のネイティブメソッドをJavaScriptで実装するために使用されます。

使用例:

```js
cheerpjInit({
	natives: {
		async Java_MyClass_myMethod(lib, str) {
			window.alert(str);
		},
	},
});
```

ネイティブメソッドの実装について詳しくは[こちら](/docs/ja/guides/Implementing-Java-native-methods-in-JavaScript)を参照してください。

### `overrideDocumentBase`

```ts
overrideDocumentBase?: string;
```

現在の`<base>` URL を、渡された`文字列`のURLに置き換えます。

使用例:

```js
cheerpjInit({ overrideDocumentBase: "YourNewURLHere" });
```

### `javaProperties`

```ts
javaProperties?: string[];
```

Javaプロパティの配列で、形式は`"key=value"`です。 これらはSystemオブジェクト（システムプロパティ）に定義されます。ネイティブJavaを使用する際に`-Dkey=value` 形式のコマンドライン引数が必要な場合にこのオプションを使用してください。

使用例:

```js
cheerpjInit({ javaProperties: ["prop1=value1", "prop2=value2"] });
```

### `tailscaleControlUrl`

```ts
tailscaleControlUrl?: string;
```

このオプションには、TailscaleコントロールプレーンのURL文字列が必要です。コントロールプレーンは、ユーザーの身元を確認し、ネットワーク内の接続されたピア間でさまざまなキーを検証します。このオプションは、[Tailscaleをセルフホスティング](https://github.com/leaningtech/headscale)している場合にのみ指定してください。省略された場合、Tailscaleのコントロールプレーンが指定されます。

使用例:

```js
cheerpjInit({ tailscaleControlUrl: "https://my.url.com/" });
```

### `tailscaleDnsUrl`

```ts
 tailscaleDnsUrl?: string;
```

DNSクエリに使用するIPv4またはIPv6アドレスの文字列を指定します。省略された場合、デフォルトのIPアドレスは「8.8.8.8」となります。

使用例:

```js
cheerpjInit({ tailscaleDnsUrl: "1.1.1.1" });
```

### `tailscaleAuthKey`

```ts
tailscaleAuthKey?: string;
```

このオプションには、Tailscale認証キーを含む文字列を指定します。認証キーを使うことで、事前に認証された新しいユーザー/デバイスを登録することができます。認証キーは[こちら](https://login.tailscale.com/admin/settings/keys)で作成できます。このオプションは[`tailscaleLoginUrlCb`](#tailscaleloginurlcb)とは相互排他的です。

> [!info] 情報
> Tailscaleの用語では、Tailscaleネットワークに接続されたユーザーとデバイスの組み合わせを _「ノード」_ と呼びます。

認証キーに関する詳細については [Tailscale認証キーのドキュメント](https://tailscale.com/kb/1085/auth-keys/)を参照してください。

使用例:

```js
cheerpjInit({ tailscaleAuthKey: "AuthKeyStringGoesHere" });
```

### `tailscaleLoginUrlCb`

```ts
tailscaleLoginUrlCb?: (url: string) => void;
```

このオプションは、Tailscaleネットワークにログインするために使用され、[`tailscaleAuthKey`](#tailscaleauthkey)とは相互排他的です。ログインプロセスを続行および完了するためには、コントロールサーバーのベースURLが必要です。このコールバックは、UIからTailscaleへのログインをユーザに指示するときに実行されます。

詳細については、[Tailscaleのドキュメント](https://tailscale.com/kb/1080/cli/#login)をご覧ください。

```js
cheerpjInit({
	tailscaleLoginUrlCb(url) {
		// your function code here to continue with login
	},
});
```

### `tailscaleIpCb`

```ts
tailscaleIpCb?: (ip: string) => void;
```

このコールバックは、Tailscaleネットワークとの接続が確立された後に、クライアントのIPアドレスを取得するために使用されます。

使用例:

```js
cheerpjInit({
	tailscaleIpCb: function (ip) {
		console.log("IP address " + ip);
	},
});
```

### `licenseKey`

```ts
licenseKey?: string;
```

このオプションにはライセンスキーが必要です。有効なライセンスキーが使用されている場合、CheerpJの表示から非商用ライセンスメッセージが削除されます。詳細については、[ライセンスガイド](/docs/ja/licensing) をご覧ください。

使用例:

```js
cheerpjInit({ licenseKey: "YourLicenseKey" });
```

[cjGetRuntimeResources]: /docs/ja/reference/cjGetRuntimeResources
[Promise]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise
[`java`]: /docs/ja/reference/cheerpjInit#java-モード
[`system`]: /docs/ja/reference/cheerpjInit#system-モード
[`permission`]: /docs/ja/reference/cheerpjInit#permission-モード
