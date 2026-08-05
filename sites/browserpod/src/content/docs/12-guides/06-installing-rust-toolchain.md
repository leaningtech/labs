---
title: Installing the Rust toolchain
description: This tutorial will guide you on installing the browserpod rust toolchain, that allows you to compile rust programs into a binary that can run in browserpod
---

In this tutorial you will be guided in installing the **Browserpod rust toolchain** that allows you to compile rust programs with browserpod as the target (also known as _crosscompiling_). Allowing you to run the compiled binaries in the pod.

Because Rust is a compiled language and there is no rust runtime inside a pod, the installation instead is about installing the browserpod toolchain that enables you to compile rust programs on your _host_ machine, into a binary that can run in browserpod.

_!!! Alt: less mention of host machine and/or more about cross compilation and different targets (or different wording)_
!!! or more explecit mention of no rust runtime being present inside the pods

### prerequisites needed

- [rustup](https://rustup.rs/#)

!!! Could add clang and llvm if C dependencies need to be added (with potential install steps or command of checking if said prerequisites are present on host machine) but not sure if overkill.

# Installing the toolchain

## 1. install the browserpod rust compilation toolchain

The easiest way to install the toolchain is by running our _install script_:

```bash
curl https://rt.browserpod.io/%BP_LATEST%/rust/install.sh | bash
```

_Alternatively you can download the rarvakk from https://rt.browserpod.io/%BP_LATEST%/rust/browserpod-rust-%BP_LATEST%.tar.gz and follow the steps of the `install.sh` contained within._

This will install a particular rust nightly version using rustup, and install the toolchain needed to compile rust to browserpod.

## 2. Set browserpod as the active project toolchain

Now that we have our toolchain installed, we can head into any of our rust projects and set browserpod as its active toolchain.

By default, rustup uses your default toolchain (usually `stable`), which doesn't know about the BrowserPod target. Setting an override tells rustup to use the BrowserPod toolchain whenever you build in this directory.

!! Can add a cd line project line and a potential cargo --hello world command line for those not having rust projects yet.

```bash
rustup override set browserpod-%BP_LATEST%
```

Alternatively you can set `browserpod-%BP_LATEST%` as the active channel in `rust-toolchain.toml`

_If you'd like to verify the installations success, You can run `rustup show active-toolchain` and see if browserpod is in the outputted list._

## 3. Build your binary

Now we can build our browserpod wasm binary!

```bash
cargo build --release --target wasm32-browserpod-linux-musl
```

that's it. You now run your rust program directly in the browser! You can find the binary in `target/wasm32-browserpod-linux-musl/release/<binary name>`.
To see how to launch a wasm binary in a [Pod](). see our [loading binaries in the pod](TBA) guide!

(also question if that warrants a full guide but might be useful for both rust and less technical rust users? also for future)

## uninstalling and/or updating

If you'd like to uninstall the toolchain, you can run first run `rustup toolchain list` to find what version you have, and then run:

```bash
rustup toolchain uninstall browserpod-<your browserpod version>
```

For updating, first uninstall, and then reinstall the updated version.

## Tips and Troubleshooting

### If your project has C dependencies

You will need `clang` and `llvm` as added prerequisites. You can check

`clang --print-targets | grep -i wasm` and `which llvm-ar` to check for their presence respectively.

!! hmm maybe this can be improved.

### Build fails with "unable to create target"

If you encounter:

```bash
error: unable to create target: 'No available targets are
compatible with triple "wasm32-unknown-unknown"'
```

Your clang was built without a WebAssembly backend. Most common on macOS,
where Apple's clang doesn't include one. You'll need to [brew](link) install llvm to add it.

```bash
brew install llvm
export BP_CLANG="$(brew --prefix llvm)/bin/clang"
```
