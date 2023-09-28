---
title: Installation on Ubuntu and Debian with apt
---

Pre-built packages for Debian/Ubuntu are provided in our [PPA](https://launchpad.net/~leaningtech-dev/+archive/ubuntu/cheerp-ppa).

## Adding the repository

To add it to your system you have two options:

#### Manually edit sources.list (works on Debian testing / stretch)

add the following line to /etc/apt/sources.list

```sh
deb http://ppa.launchpad.net/leaningtech-dev/cheerp-ppa/ubuntu focal main
```

and import the key for apt with the command

```sh
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 84540D4B9BF457D5
sudo apt-get update
```

or

#### Use add-apt-repository (Ubuntu only)

run the following command

```sh
sudo add-apt-repository ppa:leaningtech-dev/cheerp-ppa
sudo apt-get update
```

## Install packages

To install all Cheerp components, run

```sh
apt-get install cheerp-core
```
