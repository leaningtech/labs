---
title: Installing the Rust toolchain
description: This tutorial will guide you on installing the browserpod Rust toolchain, that allows you to compile Rust programs into a binary that can run in browserpod
---

In this tutorial you will be guided in installing the **BrowserPod Rust toolchain** that allows one to compile Rust programs with BrowserPod as the target (also known as _crosscompiling_). Allowing you to run the compiled binaries in the pod.

Rust is a compiled language and there is no Rust runtime inside a pod, the installation instead is about installing the browserpod toolchain that enables you to compile Rust programs on your _host_ machine, into a binary that can run in browserpod.

## Installing and setting up the toolchain

### Prerequisites

- [rustup](https://rustup.rs/#)

### 1. install the BrowserPod Rust compilation toolchain

The easiest way to install the toolchain is by running our _install script_:

```bash
curl https://rt.browserpod.io/%BP_LATEST%/rust/install.sh | bash
```

_Alternatively you can download the rarvakk from https://rt.browserpod.io/%BP_LATEST%/rust/browserpod-rust-%BP_LATEST%.tar.gz and follow the steps of the `install.sh` contained within._

This will install a particular Rust nightly version using rustup, and install the toolchain needed to compile Rust to browserpod.

### 2. Set BrowserPod as the active project toolchain

By default, rustup uses your default toolchain (usually `stable`), which doesn't know about the BrowserPod target. Setting an override tells rustup to use the BrowserPod toolchain whenever you build in this directory.

```bash
rustup override set browserpod-%BP_LATEST%
```

Alternatively you can set `browserpod-%BP_LATEST%` as the active channel in `rust-toolchain.toml`

_If you'd like to verify the installations success, You can run `rustup show active-toolchain` and see if browserpod is in the outputted list._

### 3. Build your binary

Now we can build our browserpod wasm binary!

```bash
cargo build --release --target wasm32-browserpod-linux-musl
```

That's it. You now have a binary that can run your Rust program directly in a [Pod](/docs/reference/BrowserPod)! You can find the binary in `target/wasm32-browserpod-linux-musl/release/<binary name>`.
To see how to launch a wasm binary in a [Pod](/docs/reference/BrowserPod), see our [Write files to the Pod](/docs/guides/write-files-to-pod) guide!


## Reducing binary size

Rust builds, by default are both unoptimised and carry debug info. Which, while helpfull for debugging and build speed, can significantly increase browser load times and worst case cause your binary to fail to load all together.
This is why we add the `--release` flag when building. To reduce the build size further consider creating a custom build profile in your `Cargo.toml` and setting the following settings.

| settings          | effect                                                     | cost                         |
|-------------------|------------------------------------------------------------|------------------------------|
| lto = true        | Removes unused code across crate boundaries                | longer build time            |
| codegen-units = 1 | Combine all code in a crate into a single compilation unit | longer build time            |
| opt-level = "z"   | Optimize binary size over runtime speed                    | Worse program performance    |
| strip = true      | Removes debug symbols                                      | Less useful panic backtraces |

A custom profile with all settings enabled would look like:

```toml
[profile.release-small]
inherits = "release"
lto = true
codegen-units = 1
strip = true
```

Then to build with said profile, use the `--profile` flag. 

```bash
cargo build --profile release-small --target wasm32-browserpod-linux-musl
```

_(Note that cargo creates a different build directory per profile, so the created build will now reside in: `target/wasm32-browserpod-linux-musl/release-small/<binary name>`.)_



## Uninstalling and/or updating

If you'd like to uninstall the toolchain, you can run first run `rustup toolchain list` to find what version you have, and then run:

```bash
rustup toolchain uninstall browserpod-<your browserpod version>
```

For updating, first uninstall, and then reinstall the updated version.

## Tips and Troubleshooting

### If your project has C dependencies

You will need `clang` and `llvm` as added prerequisites. You can check

`clang --print-targets | grep -i wasm` and `which llvm-ar` to check for their presence respectively.

### Build fails with "unable to create target"

If you encounter:

```bash
error: unable to create target: 'No available targets are
compatible with triple "wasm32-unknown-unknown"'
```

Your clang was built without a WebAssembly backend. Most common on macOS,
where Apple's clang doesn't include one. You'll need to [brew](https://brew.sh) install llvm to add it.

```bash
brew install llvm
export BP_CLANG="$(brew --prefix llvm)/bin/clang"
```
