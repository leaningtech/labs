---
title: ネットワーキング
description: CheerpJでのネットワーキング
---

CheerpJは、以下の2つのカテゴリーに分けられるさまざまなネットワーキングシナリオをサポートしています:

- フェッチを使用した同一オリジンのHTTP/HTTPSリクエスト。
- Tailscale を通じた一般的なネットワーキング（HTTP(S)以外のもの、例えばTCP/UDPソケットの開放など）。

## 同一オリジンのHTTP/HTTPSリクエスト

ブラウザでCheerpJを使用して実行されるJavaアプリケーションは、HTTP/HTTPSプロトコルを介してフェッチを使用してローカルサーバー（同一オリジン）にリソースをリクエストできます。当然のことながら、これらのリクエストは非同期で行われます。リクエストが同一オリジンと見なされるためには、リクエスターとレシーバーの間でスキーム、ホスト名、およびポートが一致している必要があることを覚えておいてください。

CheerpJを使用すると、通常通り[ブラウザのfetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)を使って`fetch()`リクエストを実行できます。

## 一般的なネットワーキング

CheerpJは、WebSocketsとトランスポート層を使用するVPN技術であるTailscaleを介して、より広範なネットワーキングシナリオをサポートしています。Tailscaleを使用すると、Javaアプリケーションがプライベートネットワークサービス、ピアツーピア接続、または広範なインターネットにアクセスできます。

[Tailscale](https://tailscale.com/)は[WireGuard](https://www.wireguard.com/)プロトコルに基づいています。Tailscaleには、ネットワーク内のすべてのマシンのWireGuardキーを管理し、ユーザーの認証を担当するコントロールプレーンが含まれています。このサービスを使用することで、ネットワーク、ユーザー接続、認証、セキュリティなどをより制御できます。

![CheerpJ 3.0 general networking](/docs/cheerpj3/assets/general_networking.png)

### なぜTailscaleなのか？

同一オリジンリクエストを超えるネットワーキングをサポートするためには、プロキシサーバーをホストする必要があります。アプリケーションごとに異なるネットワーキングトラフィックを内部で管理する必要があるため、CheerpJはユーザーのトラフィック全体を管理することはできません。

一般的なネットワーキングシナリオに関しては、ユーザーのセキュリティを強化するためにブラウザによって課される制限があります。これらの制限は、UDPやTCPなどの低レベルプロトコルへのアクセスをブラウザが公開しないことに関連しています。ブラウザでは、CORSポリシーに従ったHTTP(S)リクエストのみが許可されています。

このシナリオの良い例として、WebSocketsを使用するアプリケーションです。ここでは、イベント駆動型で2つのエンドポイント間で双方向のやり取りが行われます。WebSocket接続は、HTTP経由のブラウザーからのリクエストで始まり、そのリクエストが受け入れられると、この接続はアップグレードされ、HTTPプロトコルに準拠しなくなります。この方法で、ユーザーとサーバー（または他のエンドポイント）は接続を維持し、一方のエンドポイントから接続が閉じられるまで双方向のメッセージを送信できます。WebSocket接続プロトコルのアップグレードと、パケットを送信先に送る前にアンラップするには、プロキシサーバーが必要です。

Tailscaleは、WebSocketプロキシを経由してVPNを使用することができ、上記の制限に対する完璧な解決策を意味します。

### Tailscaleのインストール

Javaアプリケーションのソースコードを変更せずに一般的なネットワーキングを有効にする最も簡単な方法は[Tailscaleをインストール](https://tailscale.com/kb/1017/install)することです。これにより、クライアントは認証キーを介してプライベートTailscaleネットワークに接続し、VPNを通じてサーバーと通信できるようになります。

### アプリケーションをTailscaleネットワークに接続する

JavaアプリケーションのクライアントをTailscaleネットワークに接続するには、`cheerpjInit()`を使用してクライアント認証を提供するだけで簡単に行えます。

事前に認証されたユーザー/デバイスの場合の例:

```js
cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleAuthKey: "AuthKeyStringGoesHere",
});
```

> [!info] 情報
> Tailscaleの用語では、Tailscaleネットワークに接続されたユーザーとデバイスの組み合わせを _"ノード"_ と呼びます。

ここで何が起こっているのか？

- `tailscaleControlUrl` は、ユーザーの身元を確認するTailscaleコントロールプレーンのURL文字列です。このオプションは、[Tailscaleをセルフホスティングする](/docs/guides/Networking#self-hosting-headscale)場合にのみ渡します。
- `tailscaleAuthKey`は、事前認証済みの新規ユーザー/デバイスを登録する際に使用する認証キーの文字列です。認証キーは[こちら](https://login.tailscale.com/admin/settings/keys)で作成できます。

別タブでユーザーに手動ログインを指示する例:

```html
<a id="loginLink">Click here to login to Tailscale</a>
```

```js
const loginElem = document.getElementById("loginLink");

cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleLoginUrlCb: function (url) {
		loginElem.href = url;
		loginElem.target = "_blank";
		// continue with login
	},
});
```

ここで何が起こっているのか？

- `tailscaleLoginUrlCb` は、ログインプロセスを続行および完了するためのコントロールサーバーのベースURLを期待します。このコールバックは、UIからTailscaleへのログインをユーザに指示するときに実行されます。

> [!info] 情報
> `tailscaleLoginUrlCb` と `tailscaleAuthKey` は相互に排他的です。

CheerpJのTailscale APIの詳細については、[こちらのリファレンス](/docs/reference/cheerpjInit#tailscalecontrolurl)をご覧ください。

### Headscaleのセルフホスティング

Headscaleは、Tailscaleコントロールサーバーのオープンソースかつセルフホスティング可能な実装です。HeadscaleとCheerpJを組み合わせて使用する場合は、 [このフォーク](https://github.com/leaningtech/headscale)を使用することをお勧めします。
