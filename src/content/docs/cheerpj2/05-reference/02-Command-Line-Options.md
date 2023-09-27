---
title: Command line options
---

The basic usage of the `cheerpjfy.py` build script is:

```shell
./cheerpjfy.py application.jar
```

For more information about this script, see [AOT optimization](/cheerpj2/guides/AOT-optimization).

### `--help`

Shows all the command line options

### `-v`

Shows the CheerpJ version and the recommend `loader.js` to use in deployment.

### `--split`

Splits generated JS into smaller modules.

### `--no-runtime`

Do not automatically add the runtime to the class path.

### `--natives=NATIVESPATH`

Root of the native JS implementations for classes in this JAR file.
Assuming the `/natives` directory exists:

```shell
cheerpjfy.py --natives=native/ some.jar
```

### `--deps=DEPSPATHS`

List of `:` separated JARs that this JAR depends on. Please note that all the listed JAR paths should be either relative to the target JAR or absolute.

```shell
cheerpjfy.py --deps dependency1.jar:dependency2.jar my_application_archive.jar
```

### `--work-dir=WORKDIRPATH`

A directory where all the JARs are unpacked. This is useful to speed up multiple compilations of the same JARs and to select a different disk when not enough free space is available in the temporary directory. Keep in mind that the directory passed to the option must be manually created _before_ the command is run.

### `--core-classes-list=CORECLASSESLIST`

File containing a list of classes that should be in the core module.

### `--strip-jar=STRIPJAR`

Generates a stripped version of the input JAR with all code replaced by nops for improved compression

### `--pack-jar=PACKJAR`

Generate a packed version of the input JAR using the pack200 utility. Debug information and code are removed.
To use this command you will require to have java installed on your machine.

```shell
cheerpjfy.py yourInput.jar --pack-jar yourOutput.jar
```

> This action will overwrite your original .jar file with the packed one when using the same filename (necessary for your app to work). We recommend backing up your original files somewhere else to keep their state in case you need to use them again.

### `--stub-natives=NATIVESPATH`

Generates stubs for all native methods from classes in this JAR. The parameter must be an existing directory, it will be populated with new JavaScript files for each class having native methods.

```shell
mkdir native/
cheerpjfy.py --stub-natives=native/ some.jar

```

> **Note**: Existing files in the passed directory will be overwritten.

| macro               | Description                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `CHEERPJ_COMPRESS`  | Encode the argument in parenthesis following such scheme.                                                                       |
| `CHEERPJ_SET_CLASS` | Set the current internal class for resolving fields when using `CHEERPJ_FIELD` and `CHEERPJ_STATIC_FIELD` macros.               |
| `CHEERPJ_FIELD`     | The compiler replaces this macro with the encoded field name, it assumes the current class has been set by `CHEERPJ_SET_CLASS`. |

### `--pack-classes-list=PACKCLASSESLIST`

File containing a list of classes that should be compacted to the beginning and end of JAR file

### `--pack-strip-binaries`

Drop all dll/so/jnilib files from the JAR

### `--ignore-classes=IGNORECLASSES`

List of ',' separated classes that should not be compiled. Example --ignore-classes com.a.b.ClassOne,org.c.d.ClassTwo

### `-j NUMJOBS`

Number of parallel compilation jobs
