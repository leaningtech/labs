---
title: Files and filesystems
description: Virtual file systems and how to use them
---

The browser does not let web pages read or write files on the user's computer directly. CheerpJ gives Java applications a UNIX-style virtual file system instead, with several mount points:

```text
/
├── app/
├── files/
│   ├── downloads/
│   └── uploads/
└── str/
```

| Mount     | Description                                                                | Write     | Read |
| --------- | -------------------------------------------------------------------------- | --------- | ---- |
| `/app/`   | Files on your web server, read over HTTP                                   | No        | Yes  |
| `/files/` | Persistent storage in the browser (includes `/uploads/` and `/downloads/`) | Java only | Yes  |
| `/str/`   | Text or binary data passed from JavaScript to Java, kept in memory         | JS only   | Yes  |

| Directory           | Description                                                              | Write     | Read |
| ------------------- | ------------------------------------------------------------------------ | --------- | ---- |
| `/files/uploads/`   | Files uploaded with the window title bar's upload button, not persistent | No        | Yes  |
| `/files/downloads/` | Files saved here are automatically downloaded to the user's machine      | Java only | Yes  |

> [!info] The uploads and downloads directories need CheerpJ 4.3 or later

<div align="center">

![CheerpJ's virtual file system in the browser: /app/ is read-only, fetched from the JARs on the local server; /files/ is read-write and kept in IndexedDB, with uploads/ for files from the upload button and downloads/ for files that download automatically; /str/ holds strings and data passed from JavaScript to Java](/docs/cheerpj3/assets/filesystem.png)

</div>

> [!info] Local files
> CheerpJ's file systems are virtual: they do not correspond to the files on the user's computer, which browsers do not let web pages access directly. Local files enter the application as [uploads](#specialised-directories) and leave it as downloads.

## `/app/` mount point

The `/app/` mount point is a read-only file system over HTTP. It is the root of the web server the page comes from, and holds the application's JARs and any data it reads from the server. When Java reads a file from `/app/`, CheerpJ fetches it from the server with an HTTP or HTTPS request, in chunks, using HTTP Range requests.

For example, if the page is served from `http://127.0.0.1:8080/`:

- `/app/example.jar` is `http://127.0.0.1:8080/example.jar`
- `/app/subdirectory/example.txt` is `http://127.0.0.1:8080/subdirectory/example.txt`

To run a JAR stored in the root of the web server with [`cheerpjRunJar`]:

```js
cheerpjRunJar("/app/my_application_archive.jar");
```

> [!tip] JAR file locations
> JARs are usually under `/app/`, but they don't have to be. For example, JavaScript can write a JAR into `/str/` and then run it.

## `/files/` mount point

The `/files/` mount point is a read-write file system stored in the browser's IndexedDB. Use it for data that should persist between sessions, such as user preferences.

Only the Java application can write to `/files/`. For example:

```java
File file = new File("/files/myfile.ext");
OutputStream out = new FileOutputStream(file);
out.close();
```

> [!tip] Data persistence
> Data in `/files/` persists when the application is closed and opened again. It is deleted when the user clears the browser's data, and private (incognito) windows do not keep it. Browsers can also evict stored data under storage pressure, and each browser behaves differently.

MDN explains [when browsers evict data](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#when_is_data_evicted).

### Specialised directories

_Supported in CheerpJ 4.3 and later_

Two directories in `/files/` connect the application with the user's computer:

- **`/files/uploads/`**: a file the user uploads with the upload button (the upward arrow) in the title bar of any decorated Java window is placed here, where the Java application can read it. This directory is **not persistent**: its contents are gone when the browser restarts.

<div align="center">

![Upload button](/docs/cheerpj3/assets/upload-btn.png)

</div>

- **`/files/downloads/`**: a file the Java application writes here is downloaded to the browser's default download location.

## `/str/` mount point

The `/str/` mount point is an in-memory file system that JavaScript writes to, to pass data to Java code. Java can only read it.

### Writing files with JavaScript

Add a file from JavaScript with [`cheerpOSAddStringFile`]:

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```

Java then reads it as any other file:

```java
import java.io.FileReader;

// ...
FileReader f = new FileReader("/str/fileName.txt");
// ...
```

`cheerpOSAddStringFile` takes a JavaScript `String` or a `Uint8Array`. Use a `Uint8Array` for binary data, such as a file the user selects with an `<input type="file">` element.

## Reading files with JavaScript

To read a file from any mount point in JavaScript, use [`cjFileBlob`], which returns a `Blob`:

```js
const blob = await cjFileBlob("/files/myfile.ext");
const text = await blob.text();
console.log(text);
```

[`cjFileBlob`]: /docs/reference/cjFileBlob
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpOSAddStringFile`]: /docs/reference/cheerpOSAddStringFile
