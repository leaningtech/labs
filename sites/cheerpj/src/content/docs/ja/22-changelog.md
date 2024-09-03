---
title: 更新履歴
---

## [3.0](https://cheerpj.com/cheerpj-3-now-generally-available/) - 2024年2月1日

```html
<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
```

- JITでのすべてのJavaオペコードをサポート
- 不足しているJNIシンボルのサポートを強化
- ソケットシステムコールのサポートを改善
- JavaScriptモジュールとしてネイティブライブラリの読み込みをサポート
- ライブラリモードでプリミティブ配列のゼロコピー渡しをサポート
- 画像フィルタリングのサポートを復元
- 印刷機能のサポートを復元
- フォント処理を最適化
- サーバーがコンテンツレンジをサポートしていない場合のエラーメッセージを改善

## [3.0rc2](https://labs.leaningtech.com/blog/cheerpj-3-deep-dive) - 2023年11月29日

```html
<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
```

- デバッグメッセージの冗長性を削減
- JITでの `synchronised` メソッドをサポート
- CheerpJ 2.3と同等のAWTサポートを復元
- リフレクションのサポートを改善
- Web Workersのサポート（`importScripts`を使用）
- クリップボードのサポートを改善
- ライブラリモードを改善：オブジェクトフィールドのアクセス、配列、`instanceof`、利便性の向上およびデバッグ
- フォントのサポートを改善
- クラスローダーのサポートを改善
- プリロードのサポートを修正
- `ClassCastException`をサポート
- `cheerpjAddStringFile`を非推奨とし、`cheerpOSAddStringFile`に改名

## [3.0rc1](https://cheerpj.com/announcing-cheerpj-3-0rc1-help-us-test-and-improve/) - 2023年10月18日

```html
<script src="https://cjrtnc.leaningtech.com/3.0rc1/cj3loader.js"></script>
```

- 新しいJITベースのアーキテクチャを導入
  - AOTコンパイラを削除
- クラスローダーの完全サポートを提供
- 新しい拡張可能なJNIアーキテクチャを導入 （`cheerpjInit`の`natives`オプション）
- ライブラリモード (`cheerpjRunLibrary`)を提供
  - `cjCall` と `cjNew`を削除
- `cheerpjInit` を非同期化
- `cheerpj-dom.jar` を削除
- `cheerpjRunJarWithClasspath`を削除
- `CheerpJWorker` を削除 （3.0rc2 で`importScripts`のサポートを追加）
- `com.leaningtech.handlers` HTTPハンドラを不要に。HTTP(S)リクエストがそのまま動作するように改善

## 過去のバージョン

[CheerpJ 3.0はCheerpJの主要なアーキテクチャの書き直しでした](https://labs.leaningtech.com/blog/announcing-cheerpj-3)。

過去のバージョンについては、[CheerpJ 2.xの変更履歴](https://labs.leaningtech.com/docs/cheerpj2/changelog)をご覧ください。
