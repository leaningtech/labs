---
title: Installing the rust toolchain
description: This tutorial will guide you on instlaling the browserpod rust toolchain, that allows you to compile rust programs into a binary that can run in browserpod
---

In this tutorial you will be guided in installing the **Browserpod rust toolchain** that allows you to compile rust programs with browserpod as the target. Alowing you to run the compiled binaries in the pod. 

Because Rust is a precompiled language, the installation instead is about installing the browserpod toolchain that inables you to compile rust programs on your _host_ machine, into a binary that can run in browserpod.

_!!! Alt: less mention of host machine and/or more about cross compilation and different targets_
!!! or more explecit mention of no rust runtime being present inside the pods

### prerequisites needed
- [rustup](https://rustup.rs/#)

!!! Could add clang and llvm if C dependencies need to be added (with potential install steps or command of checking if said prerequisites are present on host machine) but not sure if overkill.

# Installing the toolchain

## 1. install the browserpod rust compilation toolchain

The easiest way to install the toolchain is by running our _install script_:

``` bash
curl https://rt.browserpod.io/%BP_LATEST%/rust/install.sh | bash
```

_Alternatively you can download the script from https://rt.browserpod.io/%BP_LATEST%/rust/browserpod-rust-%BP_LATEST%.tar.gz and follow the steps of the `install.sh` contained within._

This will install a  particular rust nightly version using rustup, and install the toolchain needed to compile rust to browserpod. 

_If you'd like to verify the installations succes, You can run `rustup toolchain list` and see if browserpod is in the outputted list._

!! what's particular about this nightly version? Could see verification step being overkill btw

## 2. Set browserpod as the active project toolchain

``` bash
rustup override set browserpod-%BP_LATEST%
```



## 3.

## uninstalling and/or upgrading

If you'd to uninstall the toolchain, you can run 

!!! Add step to identify current bp version first 

``` bash
rustup toolchain uninstall browserpod-<your browserpod version>
```

For updating, install...

## Troubleshooting

### The build fails on `libdeflate-sys`
You are most likely missing `llvm-ar`. This is common especiialy on OSX systems, since it's version of clang doesn't include it by default.


!!! maybe the override
