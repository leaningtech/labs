---
title: Command line options
---

The basic usage of the `cheerpjfy.py` build script is:

```shell
./cheerpjfy.py application.jar
```

The script also accept various command line options to customize the JAR.JS compilation process.

### --help

Shows all the command line options

### -v

Shows the CheerpJ version and the recommend `loader.js` to use in deployment.

### --split

Splits generated JS into smaller modules.

### --no-runtime

Do not automatically add the runtime to the class path.

### --natives=NATIVESPATH

Root of the native JS implementations for classes in this JAR file.

### --deps=DEPSPATHS

List of `:` separated JARs that this JAR depends on. Please note that all the listed JAR paths should be either relative to the target JAR or absolute.

### --work-dir=WORKDIRPATH

A directory where all the JARs are unpacked. This is useful to speed up multiple compilations of the same JARs and to select a different disk when not enough free space is available in the temporary directory. Keep in mind that the directory passed to the option must be manually created _before_ the command is run.

### --core-classes-list=CORECLASSESLIST

File containing a list of classes that should be in the core module.

### --strip-jar=STRIPJAR

Generates a stripped version of the input JAR with all code replaced by nops for improved compression

### --pack-jar=PACKJAR

Generate a packed version of the input JAR using the pack200 utility. Debug information and code are removed.

### --stub-natives=NATIVESPATH

Generates stubs for all native methods from classes in this JAR. The parameter must be an existing directory, it will be populated with new JavaScript files for each class having native methods. **Note**: Existing files in the passed directory will be overwritten.

### --pack-classes-list=PACKCLASSESLIST

File containing a list of classes that should be compacted to the beginning and end of JAR file

### --pack-strip-binaries

Drop all dll/so/jnilib files from the JAR

### --ignore-classes=IGNORECLASSES

List of ',' separated classes that should not be compiled. Example --ignore-classes com.a.b.ClassOne,org.c.d.ClassTwo

### -j NUMJOBS

Number of parallel compilation jobs
