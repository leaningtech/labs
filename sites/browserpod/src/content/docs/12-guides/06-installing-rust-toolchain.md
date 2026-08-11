---
title: Installing the Rust toolchain
description: How to install and use the BrowserPod Rust toolchain.
---

This guide will show you how to install and use the **BrowserPod Rust toolchain** that allows one to compile Rust programs with BrowserPod as the target. This will enable you to run the compiled binaries in the Pod.

Rust is a compiled language, and there is no Rust runtime inside a Pod. Instead, this installation sets up the BrowserPod toolchain on your _host_ machine, which lets you compile Rust programs into a binary that can run inside a Pod (a process known as [cross-compilation](/docs/more/glossary#cross-compilation)).

## Installing and setting up the toolchain

### Prerequisites

- [rustup](https://rustup.rs/) installed on your machine

### 1. Install the BrowserPod Rust compilation toolchain

The easiest way to install the toolchain is by running our _install script_:

```bash
curl https://rt.browserpod.io/%BP_LATEST%/rust/install.sh | bash
```

_Alternatively, you can download the [browserpod-rust-%BP_LATEST%.tar.gz](https://rt.browserpod.io/%BP_LATEST%/rust/browserpod-rust-%BP_LATEST%.tar.gz) tarball and follow the steps of the `install.sh` contained within._

This will install a particular Rust nightly version using rustup, and install the toolchain needed to compile Rust to BrowserPod.

### 2. Set BrowserPod as the active project toolchain

Head into your Rust project directory, then set an override so rustup uses the BrowserPod toolchain whenever you build there, instead of your default toolchain (usually `stable`, which doesn't know about the BrowserPod target).

```bash
rustup override set browserpod-%BP_LATEST%
```

Alternatively, you can set `browserpod-%BP_LATEST%` as the active channel in `rust-toolchain.toml`.

_If you'd like to verify the installation's success, you can run `rustup show active-toolchain` and see if BrowserPod is in the outputted list._

### 3. Build your binary

Now we can build our BrowserPod Wasm binary!

```bash
cargo build --release --target wasm32-browserpod-linux-musl
```

That's it! You now have a binary that can run directly in a [Pod](/docs/reference/BrowserPod)! You can find the binary in `target/wasm32-browserpod-linux-musl/release/<binary name>`.
To see how to run this binary inside a [Pod](/docs/reference/BrowserPod), see our [Creating and using terminals in the Pod](/docs/guides/run-programs-in-a-pod) guide!

## Reducing binary size

Rust builds carry debug info and remain unoptimized by default. Although this aids debugging and speeds up compilation, it inflates browser load times and, in the worst case, prevents the binary from loading at all.
This is why we add the `--release` flag when building. To reduce the build size further consider creating a custom build profile in your `Cargo.toml` and setting the following settings.

| Settings            | Effect                                                     | Cost                         |
| --------------------|------------------------------------------------------------|------------------------------|
| `lto = true`        | Removes unused code across crate boundaries                | Longer build time            |
| `codegen-units = 1 `| Combine all code in a crate into a single compilation unit | Longer build time            |
| `opt-level = "z"`   | Optimize binary size over runtime speed                    | Worse program performance    |
| `strip = true`      | Removes debug symbols                                      | Less useful panic backtraces |

A custom profile with all settings enabled would look like:

```toml
[profile.release-small]
inherits = "release"
lto = true
codegen-units = 1
opt-level = "z"
strip = true
```

Then to build with said profile, use the `--profile` flag.

```bash
cargo build --profile release-small --target wasm32-browserpod-linux-musl
```

_(Note that cargo creates a different build directory per profile, so the created build will now reside in: `target/wasm32-browserpod-linux-musl/release-small/<binary name>`.)_

## Uninstalling and/or updating

If you'd like to uninstall the toolchain, you can first run `rustup toolchain list` to find what version you have, and then run:

```bash
rustup toolchain uninstall browserpod-<your browserpod version>
```

For updating, first uninstall, and then reinstall the updated version.

## Tips and Troubleshooting

### If your project has C dependencies

You will need `clang` and `llvm` as added prerequisites. You can check `clang --print-targets | grep -i Wasm` to verify your clang build supports Wasm. Also use the command `which llvm-ar` to verify llvm is installed.

### Build fails with "unable to create target"

If you encounter:

```bash
error: unable to create target: 'No available targets are
compatible with triple "wasm32-unknown-unknown"'
```
Your clang was built without a WebAssembly backend, most common on macOS.
You'll need to [brew](https://brew.sh) install llvm to add it.

```bash
brew install llvm
export BP_CLANG="$(brew --prefix llvm)/bin/clang"
```

With `BP_CLANG` set, uninstall and reinstall the toolchain (see [Uninstalling and/or updating](#uninstalling-andor-updating) above) so it picks up the Wasm-capable clang.
