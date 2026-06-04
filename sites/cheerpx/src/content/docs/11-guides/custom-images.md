---
title: Custom disk images
description: How to create custom ext2 images to use as a filesystem for CheerpX
---

This guide shows how to setup an OCI image and build it into an `ext2` disk image that CheerpX can use as its filesystem.

_An OCI image is a packaged, ready-to-run snapshot of a filesystem (everything an app needs to run). Here we build one, then convert its filesystem into an `ext2` disk image for CheerpX. New to images? See Docker's [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)._

**Prerequisites:** a **Linux host** with `buildah` and `mkfs.ext2` installed.

## 1. Creating our OCI image

### 1.1 Create a Dockerfile

First, create your `Dockerfile` to define the environment. Here's an example of a Dockerfile that installs the `curl` command:

```dockerfile
FROM --platform=linux/i386 docker.io/i386/debian:buster
ARG DEBIAN_FRONTEND=noninteractive

# Point APT to the archived mirrors (Buster is EOL)
RUN echo "deb [trusted=yes] http://archive.debian.org/debian buster main contrib non-free" \
  > /etc/apt/sources.list && \
	echo "deb [trusted=yes] http://archive.debian.org/debian-security buster/updates main" \
	>> /etc/apt/sources.list

RUN apt-get update && apt-get -y upgrade && apt-get -y install curl
```

> [!note] Note
> The base image's architecture must be 32-bit x86 (for example, `i386` or `i686`).

### 1.2 Creating our image

Once the `Dockerfile` is ready, use `buildah` to create an OCI image.

```bash
buildah build -f Dockerfile --dns=none --platform linux/i386 -t cheerpximage
```

### 1.3 Create a container from the OCI Image

Now that we have our image, we can build our container

```bash
buildah from --name cheerpxcontainer cheerpximage
```

## 2 Building our ext2 image

With the container created, we can now use its filesystem to build the actual `ext2` disk image that will be used by CheerpX.

### 2.1 Enter a user namespace

We will use `buildah unshare` to enter 'rootless mode'. This way we can mount the container safely without requiring actual root privileges.

```bash
buildah unshare
```

### 2.2 Mount the container filesystem

Now we can safely mount the filesystem to our host machine to build our image from it. Be sure to save the outputted path for the next 2 steps!

```bash
buildah mount cheerpxcontainer
```

> [!note]
> Seeing a `subuid`/`subgid` or "potentially insufficient UIDs or GIDs" error here? See the optional [`/etc/subgid`](#optional-edit-etcsubgid-for-the-host-user) step at the end of this guide.

### 2.3 Check filesystem size

We'll quickly check the size of our mounted filesystem so we know how much size we should allocate for the `ext2` image

```bash
du -sh "your/path/to/mountpoint"
```

> [!note] Reserve (a little) extra space
> We recommend allocating a bit more than the size of the filesystem to prevent "out of space" errors. (Files will get stored in the browser, but the image still needs to see some space available.)
> Though do please also note _that the max image size for CheerpX is 2GB_

### 2.4 Build the image

Pass the mount path outputted by `buildah mount` to `mkfs.ext2` to finally build our disk image!

```bash
mkfs.ext2 -b 4096 -d your/path/to/mountpoint cheerpXImage.ext2 600M
```

### 2.5 Clean up

Now that we have our `ext2` disk image, we can go ahead and clean up everything else.

```bash
buildah umount cheerpxcontainer
buildah rm cheerpxcontainer
exit
buildah rmi cheerpximage
```

## Conclusion

Congratulations! You have successfully created a custom `ext2` image that can be used as a filesystem for CheerpX. This image is now ready to be loaded into your CheerpX environment for further testing and deployment.

If you'd like to see more details on how to implement the custom `ext2` image with CheerpX, please refer to the [Full OS](/docs/tutorials/full_os) tutorial.

## Optional: edit `/etc/subgid` (for the host user)

The `/etc/subgid` file defines the ranges of subordinate group IDs allocated to specific user accounts on the host for managing user namespaces in containers. This step is **optional** and not necessary for most use cases — most systems set this up automatically. You only need it if mounting the container (step 2.2) fails with a `subuid`/`subgid` or UID/GID mapping error. After editing the file, re-run the build from step 2.1.

### 1. Identify your host user

Run the following command to determine the host user running container commands:

```bash
whoami
```

### 2. Check `/etc/subgid` for your user

Open `/etc/subgid` and look for an entry matching your user:

```bash
sudo nano /etc/subgid
```

The file should contain lines in the format:

```
<username>:<start_id>:<count>
```

For example, for the user `johndoe`:

```
johndoe:100000:65536
```

### 3. Modify the file

If you need to change the `subgid` range for the host user, modify the `start_id` and/or `count` as needed. For example, if you want to assign a new range starting at 200000 with a count of 65536, you would change it to:

```
johndoe:200000:65536
```

For more information about `subgid`, refer to the [subgid documentation](https://man7.org/linux/man-pages/man5/subgid.5.html).
