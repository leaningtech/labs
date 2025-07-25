---
title: よくある質問
language: ja
---

## CheerpJとは何ですか？

CheerpJは、ブラウザベースのHTML5/JavaScriptウェブアプリケーションで、修正されていないJavaクライアントアプリケーションを実行するためのソリューションです。CheerpJは、JavaScriptによる完全なJavaランタイム環境と、動的クラス生成のためのその場で使えるコンパイラで構成されており、アプリケーションと共にデプロイされます。

## Java SEランタイムのどの部分がサポートされていますか？

CheerpJランタイム環境は、JavaScriptで実装された完全なJava SEランタイムです。他の技術がJavaScriptで手動で部分的に再実装を提供するのとは異なり、私たちはOpenJDK Java SEランタイム全体をJavaScriptとWebAssemblyに置き換えることを選びました。CheerpJランタイムのすべてのコンポーネントは、アプリケーションによって必要に応じて動的にダウンロードされ、全体のダウンロードサイズを最小限に抑えます。CheerpJランタイムライブラリは、専用のCDNサポートドメインで私たちによってホストされており、ユーザーにはキャッシングとアプリケーション間のリソース共有を活用するためにそれにリンクすることをお勧めします。

## サポートされているJavaバージョンはどれですか？

CheerpJはJava 8をサポートしています。将来的には、後のLTSバージョンのJavaもサポートする予定です。

CheerpJ 3.0で導入された新しいアーキテクチャは、最新のJavaバージョンとのギャップを簡単に解消するよう設計されています。今後のCheerpJ 3.1リリースでJava 11（および可能であればその他のバージョン）のサポートを計画しています。

## CheerpJランタイムをセルフホストできますか？

CheerpJとそのランタイムを自分のインフラでセルフホストすることについては、[こちら](https://cheerpj.com/contact/)からお問い合わせください。

## CheerpJを使用して、ソースコードにアクセスできないレガシーJavaアプリケーションをブラウザで実行できますか？

はい。CheerpJを使用すれば、ソースコードに触れることなく、任意のJava SEアプリケーションを実行できます。必要なのは、アプリケーションのすべての.jarアーカイブだけです。

## Javaライブラリを使用し、CheerpJを使用してそれらをHTML5アプリケーションに統合できますか？

はい。Javaメソッドは、利便性のためにasync/awaitに対応したインターフェースを通してJavaScriptに公開することができます。

## JavaからJavaScriptライブラリやWeb APIを呼び出すことができますか？

はい。CheerpJを使用すると、任意のJavaScriptやブラウザAPIと相互運用できます。JavaScriptで実装されたJavaネイティブメソッドもサポートされています。

## CheerpJはリフレクションをサポートしていますか？

はい、サポートしています。

## CheerpJは動的クラス生成をサポートしていますか？

はい、サポートしています。

## CheerpJを実行すると、ブラウザコンソールに404/403エラーが表示されます。何が起こっているのですか？

これらのエラーは無視してください。CheerpJは、HTTPの上にファイルシステムの実装を提供しています。このコンテキストでは、一部のファイルが見つからないのは問題ありません。CheerpJは404エラーを正しく解釈し、ファイルが見つからなかった状態として処理します。

## CheerpJでコンパイルされたアプリケーションが動作せず、画面上部に「CheerpJ runtime ready」と表示されるだけです。何が起こっているのですか？

初めてのユーザーの多くはこの時点で行き詰まります。最も一般的な問題は次のとおりです：

- HTMLページをディスクから直接開いている：ブラウザのURLは常にhttp:// または https:// で始まる必要があります。file:// で始まる場合、CheerpJは動作しません。テスト中はローカルウェブサーバーを使用する必要があります。
- Webページで使用されているJARファイルに「/app/」プレフィックスを追加するのを忘れている：CheerpJは複数のマウントポイントを持つ仮想ファイルシステムを実装しており、「/app/」プレフィックスが必要です。
- 一般的に、ブラウザの開発者ツールの「ネットワークタブ」を使用して、JARが正しくダウンロードされているか確認できます。JARがまったくダウンロードされない場合や、404エラーが返される場合、JARパスに問題があることを示しています。「ネットワークタブ」に何も表示されない場合は、開発者ツールを開いたままページをリロードしてください。

## CheerpJやCheerpJ Applet Runner拡張機能を使ってOld School RuneScapeをプレイできますか？

まだできません。主な問題は、RuneScapeが必要とする低レベルのネットワーク接続プリミティブ（ソケット）が、セキュリティ上の理由から現在のブラウザでは提供されていないことです。将来的には、トンネリングを通じてこのユースケースをサポートするために、CheerpJ Applet Runner拡張機能の有料アドオンを提供する可能性があります。

## CheerpJの現状はどうなっていますか？

CheerpJは、JavaScriptへのコンパイルとWebAssemblyへのコンパイルソリューションを専門とする英蘭会社：[Leaning Technologies Ltd](https://leaningtech.com)によって積極的に開発されています。
