---
title: ネイティブメソッドとライブラリの実装
description: CheerpJでのJavaネイティブインターフェース (JNI)
language: ja
---

CheerpJを使用すると、通常C/C++や他のAOTコンパイル言語で実装されるJavaの「ネイティブ」メソッドを、Java Native Interface（JNI）を使用するのと同様に、JavaScriptで実装することができます。

これらのメソッドは、Javaコード内で`native`キーワードによって宣言されていることで識別できます。これらの関数はJavaでは実装されておらず、代わりにJavaScriptで実装されます。

## `cheerpjInit`の`natives`オプションを使用する

`cheerpjInit`は、ネイティブメソッドの実装を提供するための`natives`オブジェクトを受け取ります。このオブジェクトのキーはネイティブメソッドの名前で、値はその実装です：

- **キー:** 形式は`Java_<fully-qualified-class-name>_<method-name>`の文字列です。例えば、`com.foo.Bar`に`baz`というネイティブメソッドがある場合、そのオブジェクトキーは`Java_com_foo_Bar_baz`です。
- **値:** 最初のパラメーターとして[`CJ3Library`]オブジェクトを受け取り、続いてメソッドのパラメーターを取る非同期関数です。この関数は値を返すか、値を解決するPromiseを返すことができます。

パラメーターと戻り値は、[変換ルール]が適用されます。

### 例

次のJavaクラスを考えてみましょう：

```java title="Example.java"
public class Example {
	public static void main(String[] args) {
    alert("Hello, world!");
	}

  public static native void alert(String message);
}
```

`alert`の実装を提供するには、`cheerpjInit`関数に`natives`オブジェクトのプロパティとして渡します：

```js
await cheerpjInit({
	natives: {
		async Java_Example_alert(lib, str) {
			window.alert(str);
		},
	},
});
await cheerpjRunMain("Example", "/app/");
```

`lib`パラメーターは[`CJ3Library`]であり、ライブラリの他のクラスやメソッドにアクセスするために使用できます。

JNI呼び出しのパラメーターと戻り値は、JavaScript型とJava型の間で自動的に変換されます。

## 共有/動的ライブラリ用の`System.loadLibrary`の使用

[`System.loadLibrary(String libname)`]は、ネイティブライブラリ(`.so`、`.dll`、または`.dylib` ファイル)を読み込み、そのメソッドをJavaコードで利用できるようにするJavaメソッドです。ライブラリは、`java.library.path`内の各パスから`libname.so`（WindowsとmacOSではそれぞれ`libname.dll`または`libname.dylib`）というファイルを検索することで見つかります。

CheerpJも同様に動作しますが、`libname.js`というファイルを探します。このファイルは、前述の`natives`オブジェクトと同じ構造を持つオブジェクトをエクスポートするモジュールである必要があります。

### 例

```java title={Example.java}
public class Example {
  static {
    System.loadLibrary("native");
  }

  public static void main(String[] args) {
    new Example().alert("Hello, world!");
  }

  private native void alert(String message);
}
```

```js title={native.js}
export default {
	async Java_Example_alert(lib, self, message) {
		window.alert(message);
	},
};
```

```js
await cheerpjInit({ javaProperties: ["java.library.path=/app/"] });
await cheerpjRunMain("Example", "/app/");
```

[`CJ3Library`]: /docs/ja/reference/CJ3Library
[変換ルール]: /docs/ja/reference/cheerpjRunLibrary#conversion-rules
[`System.loadLibrary(String libname)`]: https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#loadLibrary-java.lang.String-
