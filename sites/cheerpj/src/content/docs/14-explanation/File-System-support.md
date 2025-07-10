---
title: Files and filesystems
description: Virtual filesystems and how to use them
---

CheerpJ filesystems are implemented as UNIX-style virtual filesystems with multiple mount points:

| Mount     | Description                                                        | Write     | Read |
| --------- | ------------------------------------------------------------------ | --------- | ---- |
| `/app/`   | An HTTP-based filesystem for loading files from the web server     | No        | Yes  |
| `/files/` | A persistent read-write file system                                | Java only | Yes  |
| `/str/`   | A filesystem for passing JavaScript strings or binary data to Java | JS only   | Yes  |

![](/docs/cheerpj3/assets/filesystem.png)

> [!info] Local files
> CheerpJ provides access to a virtualized filesystem, which does not correspond to the local user's computer. Accessing local files directly is forbidden for browser security reasons.

## `/app/` mount point

The `/app/` mount point corresponds to a virtual read-only, HTTP-based filesystem. `/app/` can be used for multiple purposes including accessing JAR files and data from your local server.

The `/app/` mount point refers to the root of your web server. When a file is read from `/app/`, CheerpJ will make an HTTP(S) request to fetch the file.

To have a clearer concept of the `/app/` mount point, let's assume that HTML file with the CheerpJ application is served from the `http://127.0.0.1:8080/` origin:

- `/app/example.jar` would be the same as `http://127.0.0.1:8080/example.jar`

- `/app/subdirectory/example.txt` would be the same as `http://127.0.0.1:8080/subdirectory/example.txt`

Considering the examples above, to run a JAR with [`cheerpjRunJar`] and assuming it is stored in the root of the web server, it should be done as follows:

```js
cheerpjRunJar("/app/my_application_archive.jar");
```

> [!tip] JAR file locations
> The `/app/` mount point is the most common location to store the application's JARs but this is not mandatory. For example, you could write a JAR file into `/str/` with JS and then run that.

## `/files/` mount point

The `/files/` mount point corresponds to a virtual read-write, IndexedDB-based filesystem and it is used to store persistent data in the browser client.

Use this for storing data that should persist between sessions, such as user preferences.

Writing files into the `/files/` mount point is only possible from inside the Java application. For example:

```java
File file = new File("/files/myfile.ext");
OutputStream out = new FileOutputStream(file);
out.close();
```

> [!tip] About data persistency
> The data in this mount-point would persist even when closing the application and re-launching it. In the scenario of wiping out the browser's data or using the browser as "incognito" data will be evicted. This behaviour may vary depending in the browser used among other scenarios.

For more information about browser's data eviction and persistency please visit [this page](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#when_is_data_evicted).

## `/str/` mount point

The `/str/` mount point is a simple filesystem that can be populated from JavaScript to share data with Java code. This filesystem is read-only from Java.

### Writing files with JavaScript

From JavaScript, it is possible to add files into the filesystem using the [`cheerpOSAddStringFile`] API. Example:

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```

Then, you can access this data from Java, for example:

```java

import java.io.FileReader;

...
FileReader f = new FileReader("/str/fileName.txt")
...

```

The `cheerpOSAddStringFile` API can be used with JavaScript `String`s or `Uint8Array`s. `Uint8Array`s may be useful to provide binary data to the Java application. For example, a selected file coming from an HTML5 `<input type="file">` tag.

## Reading files with JavaScript

To read files from any of the mount-points using JavaScript, you must use the [`cjFileBlob`] API as follows:

```js
const blob = await cjFileBlob("/files/myfile.ext");
const text = await blob.text();
console.log(text);
```

[`cjFileBlob`]: /docs/reference/cjFileBlob
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpOSAddStringFile`]: /docs/reference/cheerpOSAddStringFile
