---
title: Files and filesystems
description: Virtual filesystems and how to use them
---

CheerpX implements UNIX-style virtual filesystems with multiple mount points, providing a flexible and secure way to manage files and data in your web-based Linux environment:

| Filesystem Type | Description                                             | Write | Read |
| --------------- | ------------------------------------------------------- | ----- | ---- |
| WebDevice       | HTTP-based filesystem for loading files from web server | No    | Yes  |
| IDBDevice       | Persistent read-write filesystem using IndexedDB        | Yes   | Yes  |
| DataDevice      | In-memory filesystem for temporary data storage         | Yes   | Yes  |
| HttpBytesDevice | A block device with a Linux filesystem inside (ext2)    | No    | Yes  |
| OverlayDevice   | A writable persistent overlay on another block device   | Yes   | Yes  |

> [!info] Virtual Environment
> CheerpX provides access to a virtualized filesystem environment, which does not correspond to the local user's computer. Direct access to local files is restricted due to browser security constraints.

## WebDevice

[`WebDevice`](/docs/reference/CheerpX.WebDevice) is a read-only, HTTP-based filesystem in CheerpX. It's primarily used for accessing files from your web server.

### Usage

To [create](/docs/reference/CheerpX.WebDevice/create) a [`WebDevice`](/docs/reference/CheerpX.WebDevice), use the `CheerpX.WebDevice.create()` method:

```js
const webDevice = await CheerpX.WebDevice.create("path/to/local/directory");

const cx = await CheerpX.Linux.create({
	mounts: [ ... , { type: "dir", path: "/web", dev: webDevice }],
});
```

This will mount the specified directory at `/web` in the CheerpX filesystem. To enable listing the directory contents, CheerpX looks for an `index.list` file in the directory and any subdirectories. This file should contain a newline-separated list of all files and subdirectories within the directory.

### Why use an `index.list` file?

The `index.list` file enables CheerpX to provide directory listing functionality in its WebDevice. Since HTTP does not have native support for file listing, `index.list` is essential for managing and accessing files effectively.

### Creating an `index.list` file

To generate an `index.list` in every directory without including it in the directory listing, use the following command:

```bash
find . -type d -exec sh -c 'ls "{}" > "{}"/.index.list && mv "{}"/.index.list "{}"/index.list' \;
```

**Explanation**:

1. `find . -type d`: finds all directories starting from the current directory (`.`).

2. `-exec sh -c`: executes the following shell commands for each directory found.

3. `ls "{}" > "{}"/.index.list`: lists the directory contents and saves it to `.index.list`.

4. `&& mv "{}"/.index.list "{}"/index.list`: renames `.index.list` to `index.list` in the same directory.

> [!warning] Warning
> Be careful when using this command. It will overwrite any existing index.list files in every directory it processes. Ensure you run it only in the intended directory and back up any important data before execution. Misuse in the wrong directory could cause unintentional data loss.

### Accessing files

Files in the WebDevice are accessed relative to the current page's URL. For example, if your current page is `https://host/dir1/dir2/page.html`, then:

- `/web/example.txt` would correspond to `https://host/dir1/dir2/path/to/local/directory/example.txt`
- `/web/images/logo.png` would correspond to `https://host/dir1/dir2/path/to/local/directory/images/logo.png`

> [!note] Note
> It's important to note that this behavior depends on the current page's URL, as it uses a relative path. For more predictable results, it's recommended to use absolute paths when possible.

### Using `application/octet-stream` for WebDevice directories

`application/octet-stream` is a MIME type used to indicate that a file is binary data, instructing the server and client to treat the file as raw bytes instead of interpreting it as text or any other format.

In CheerpX, **make sure to apply the `application/octet-stream` MIME type** to WebDevice directories to handle files correctly as binary data, preventing issues with images, scripts, and other non-text files.

**Creating the Webdevice:**

```js
// The path must match the nginx location block (e.g., /webdevice in the nginx configuration)
const webDevice = await CheerpX.WebDevice.create("/webdevice");
```

**Nginx configuration example**:

```nginx
worker_processes  1;
error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

events {
    worker_connections  1024;
}

http {
    default_type  application/octet-stream;
    access_log  nginx_access.log;
    error_log   nginx_error.log info;

    sendfile        on;

    add_header 'Cross-Origin-Opener-Policy' 'same-origin' always;
    add_header 'Cross-Origin-Embedder-Policy' 'require-corp' always;

    server {
        listen       8080;
        server_name  localhost;

        gzip on;
        gzip_types application/javascript application/wasm text/plain;

        charset utf-8;

        location / {
            root .;
            index  index.html index.htm;
        }

        # Create the WebDevice for handling files in the /webdevice directory
        location /webdevice/ {
            root .;
            autoindex on;
            types { }
            default_type application/octet-stream;
        }
    }
}
```

For a full server setup and additional details, check our [basic server guide](/docs/guides/nginx).

## IDBDevice

IDBDevice provides a persistent, read-write filesystem using the browser's IndexedDB. It's ideal for storing data that should persist between sessions.

### Usage

Create an IDBDevice using the `CheerpX.IDBDevice.create()` method:

```javascript
const idbDevice = await CheerpX.IDBDevice.create("dbName");

const cx = await CheerpX.Linux.create({
	mounts: [ ... , { type: "dir", path: "/files", dev: idbDevice }],
});
```

This setup creates a virtual filesystem at `/files` that is backed by IndexedDB.

### Reading files from JavaScript

You can read files from an `IDBDevice` in JavaScript using the `readFileAsBlob` method:

```javascript
await idbDevice.readFileAsBlob("/filename");
```

### `idbDevice.readFileAsBlob`

`CheerpX.IDBDevice` provides a method to read back files as JavaScript accessible data.

```js
await idbDevice.readFileAsBlob(filename: string): Promise<Blob>
```

**Parameters**:

- **filename**: A string representing the path to the file within the device, starting with a `/` (e.g., "/filename"). Do not include the mount point.

**Returns**:

The method returns a Promise that resolves to a standard JavaScript Blob object.

Example:

```js
const idbDevice = await CheerpX.IDBDevice.create("files");
// Use CheerpX to write something to the device
const outputBlob = await idbDevice.readFileAsBlob("/filename");
```

> [!note] Note
> The `readFileAsBlob` API returns a standard JavaScript Blob object. You can convert it to a string if needed, but you can also convert it to an `ArrayBuffer` or to a URL via `URL.createObjectURL`.

## DataDevice

`DataDevice` is an in-memory filesystem useful for temporary data storage or passing data from JavaScript to the CheerpX environment.

### Usage

Create a DataDevice using the `CheerpX.DataDevice.create()` method:

```javascript
const dataDevice = await CheerpX.DataDevice.create();

const cx = await CheerpX.Linux.create({
	mounts: [ ... , { type: "dir", path: "/data", dev: dataDevice }],
});
```

### Adding files

You can add files to a DataDevice from JavaScript using the `writeFile` method:

```javascript
await dataDevice.writeFile("/filename", "File content here");
```

### `dataDevice.writeFile`

`CheerpX.DataDevice` provides a method to write data to new files within the mounted device. This utility is limited to creating files at the root level of the device.

```js
await dataDevice.writeFile(filename: string, contents: string | Uint8Array): Promise<void>
```

**Parameters**:

- **filename**: A string representing the path to the file within the device, starting with a `/` (e.g., "/filename"). Do not include the mount point.
- **contents**: The data to write to the file. Can be either a string or a Uint8Array.

**Returns**:

The method returns a Promise that resolves when the file has been created and written to. It doesn't return any value.

Example:

```js
const dataDevice = await CheerpX.DataDevice.create();
await dataDevice.writeFile("/filename", "contents");
```

> [!note] Note
>
> - This is the only way to create files in this device.
> - Modifying existing files or creating files in subdirectories is not possible.

## Block devices with ext2

CheerpX supports ext2 filesystems, which can be configured as an [`OverlayDevice`](/docs/reference/CheerpX.OverlayDevice). This allows for a flexible setup that can combine different storage types.

### Usage

Create an ext2 filesystem by combining a `HttpBytesDevice` to acess disk blocks, an `IDBDevice` to cache and persist data and a [`OverlayDevice`](/docs/reference/CheerpX.OverlayDevice) to combine the two.

```javascript
// Create an HttpBytesDevice for streaming disk blocks via HTTP
const httpDevice = await CheerpX.HttpBytesDevice.create(
	"https://yourserver.com/image.ext2"
);

// Create an IDBDevice for persistent local storage
const idbDevice = await CheerpX.IDBDevice.create("block1");

const overlayDevice = await CheerpX.OverlayDevice.create(httpDevice, idbDevice);

const cx = await CheerpX.Linux.create({
	mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
});
```

This setup creates an ext2 filesystem that loads its initial data from an HTTP source and uses IndexedDB for persistent storage of changes.

### Device configuration options

CheerpX supports various types of devices that can be used in the OverlayDevice configuration:

1. **HttpBytesDevice**: The default choice for loading filesystem images via HTTP. Suitable for most web-hosted files.
2. **GitHubDevice**: Ideal for projects forked from the [WebVM](https://github.com/leaningtech/webvm/) repository. The Integrated GitHub Action will take care of preparing disk chunks for efficient access.
3. **OverlayDevice**: `OverlayDevice` supports chaining, making it possible to efficiently "fork" disk images while only storing the changes from previous versions.

## Best practices

1. Use WebDevice for read-only access to server-side files.
2. Utilize IDBDevice for persistent storage of user data or application state.
3. Employ DataDevice for temporary storage or passing data between JavaScript and CheerpX.
4. Consider ext2 filesystems for more complex file operations or when you need a traditional Linux filesystem structure.

By leveraging these different filesystem types, you can create a flexible and efficient file management system within your CheerpX-powered web application.
