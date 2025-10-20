---
title: Installation
description: How to install the Cheerp toolchain on your favourite operating system
---

The first step to using Cheerp is to install the Cheerp toolchain.

> [!info] Command Line Notation
> Throughout this documentation, we’ll show some commands used in the terminal. Lines that you should enter in a terminal all start with `$`. You don’t need to type the `$` character; it’s the command line prompt shown to indicate the start of each command. Lines that don’t start with `$` typically show the output of the previous command.

## Installing Cheerp on Linux

[![Packaging status](https://repology.org/badge/vertical-allrepos/cheerp.svg)](https://repology.org/project/cheerp/versions)

#### Ubuntu

> [!info] Releases
> we offer both stable and nightly builds,
> but since our stable build is at this time a few years old, we recommend using nightly

Use our nightly build [PPA](https://launchpad.net/~leaningtech-dev/+archive/ubuntu/cheerp-nightly-ppa)

(or alternatively our stable build [PPA](<(https://launchpad.net/~leaningtech-dev/+archive/ubuntu/cheerp-ppa):>))

```sh
$ sudo add-apt-repository ppa:leaningtech-dev/cheerp-nightly-ppa
$ sudo apt-get update
$ sudo apt-get install cheerp-core
```

> [!warning] being ahead of our supported LTS builds
> if you encounter a "the repo does not have a Release file" error
> your Ubuntu release is most likely newer than our latest build. In this case you will need to manually edit the .sources file following the steps below.

1. open the .sources file for the PPA release, which is located at:

```
/etc/apt/sources.list.d/leaningtech-dev-ubuntu-cheerp-nightly-ppa-<codename>.sources
```

With `<codename>` being replaced by the codename of your release

(You can find your current codename using `lsb_release -cs`)

2. Check which releases we have a build for [here](https://ppa.launchpadcontent.net/leaningtech-dev/cheerp-nightly-ppa/ubuntu/dists/) and change the `Suites:` line to specify our latest LTS release instead of your codename.

   (Even if our latest build is an LTS release behind there should be no issues, since cheerp uses minimal dependencies)

3. ```sh
   $ sudo apt-get update
   $ sudo apt-get install cheerp-core
   ```

<br>
<br>

#### Arch

Use our [AUR package](https://aur.archlinux.org/packages/cheerp-git):

```sh
$ yay -S cheerp-git
```

> [!warning] This might take a while
> `cheerp-git` will compile Cheerp from source. For a faster install, you can use the community-maintained `cheerp-bin` package which unpacks the Ubuntu package.

<!-- TODO: Nix -->

#### Build from source

Users on other Linux distributions must [build Cheerp from source](/docs/building-from-source/linux).

## Installing Cheerp on Windows

Download the latest graphical installer from [GitHub](https://github.com/leaningtech/cheerp-meta/releases) and follow the installation wizard. The default installation path is currently the only supported one.

You can also [build Cheerp from source](/docs/building-from-source/windows) if you prefer.

If you are using WSL, follow the [instructions for Linux](#installing-cheerp-on-linux).

## Installing Cheerp on macOS

<!-- TODO: brew -->

Download the DMG image for macOS from [GitHub](https://github.com/leaningtech/cheerp-meta/releases) and install it by opening the image and drag-and-dropping Cheerp into the `/Applications` directory.

The binary is not signed so you may need to run the following to stop Gatekeeper from blocking the executable:

```sh
$ sudo xattr -d com.apple.quarantine /Applications/cheerp/bin/*
```

## Testing

To check whether you have installed Cheerp correctly, you can run the following command:

```sh
$ /opt/cheerp/bin/clang++ --version
```

You should see the version of Cheerp that you have installed. If you see something like "no such file or directory", then Cheerp is not installed correctly.

If you are having any problems, ask for help in the `#support` channel on our [Discord server](https://discord.leaningtech.com).
