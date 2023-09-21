---
title: DOM and JavaScript interoperability
---

CheerpJ allows users to interact with the browser DOM directly from Java, without overhead. To achieve this you will need to use the CheerpJ [Java API](/cheerpj2/reference/Java-API) (`cheerpj-dom.jar`) and found at the CheerpJ [downloadable archive](<(https://leaningtech.com/download-cheerpj/)>). Usage examples are shown below.

## Basic example

```java title="DomExample.java"
import com.leaningtech.client.Document;
import com.leaningtech.client.Element;
import com.leaningtech.client.Global;
import com.leaningtech.client.JSString;

public class DomExample
{
        public static void main(String[] a)
        {
                // Retrieve the global document object, it comes from the global namespace of the browser.
                Document d = Global.document;
                // Retries a known element from the page using it's id
                // NOTE: Java Strings must be converted to JavaScript string before being used
                Element e = d.getElementById(Global.JSString("existingNode"));
                // Currently, setter/getters must be used to access properties
                e.set_textContent(Global.JSString("sometext"));
                Element newDiv = Global.document.createElement(Global.JSString("p"));
                // Initialize the new element with text derived from the previous one
                newDiv.set_textContent(e.get_textContent().substring(3).toUpperCase())
                // Add it to the document body
                Global.document.get_body().appendChild(newDiv);
                JSString divContent = newDiv.get_textContent();
                // This logs directly to the browser console
                Global.console.log(divContent);
        }
}
```

## Using Strings

It's important to keep in mind that Java Strings are not JavaScript Strings. To avoid confusion, in CheerpJ the `JSString` name is used for the JS version. The static `Global.JSString` utility function can be used to create `JSString`s from Java `String`s. If a `JSString` needs to be used many times it could be useful to cache it. Similarly the `Global.JavaString` function can be used to convert back from `JSString` to normal Java `String`. See [Global.JSString](/cheerpj2/reference/Java-API#globaljsstring) and [Global.JavaString](/cheerpj2/reference/Java-API#globaljavastring).

## Calling JS methods

The `Global` class provides a few static methods that can be used to call arbitrary JS functions in the global scope, See [Global.jsCall](/cheerpj2/reference/Java-API#globaljscall--jscalli-j-scalld--jscalls)

The various methods behave the same, with the only difference being the expected return type. As JavaScript functions are untyped CheerpJ does not have enough information to auto-box the returned values, so you need to use the right return type on the call site. Java Strings parameters will be automatically converted to JavaScript Strings.

## Building the code

Assuming the example above is contained in `DomExample.java`, you need to first build the program using the standard `javac` compiler, create a JAR and then create the JAR.JS from it using CheerpJ. In both steps the `cheerpj-dom.jar` must be explicitly added to the command line as a dependency.

```shell
# The CHEERPJ_INSTALL_PATH is assumed to be set to the location where the CheerpJ archive has been installed
javac -cp $CHEERPJ_INSTALL_PATH/cheerpj-dom.jar DomExample.java
jar cvf domexample.jar DomExample.class
$CHEERPJ_INSTALL_PATH/cheerpjfy.py --deps $CHEERPJ_INSTALL_PATH/cheerpj-dom.jar domexample.jar
```

## Further reading

- [Java API](/cheerpj2/reference/Java-API) (Reference)
