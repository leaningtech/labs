---
title: Installation on RHEL8 and CentOS
---

We provide pre-built RPM packages for RHEL8 (and CentOS 8).

# Packages

We provide a repo with stable builds at https://rpm.leaningtech.com/stable and a repo with nightly builds at https://rpm.leaningtech.com/nightly.

To install Cheerp just add the repo configuration file (Stable in this case):

```sh
cat << EOF > /etc/yum.repos.d/cheerp.repo
[Cheerp-Stable]
name=Cheerp Stable
gpgcheck=1
gpgkey=https://rpm.leaningtech.com/RPM-GPG-KEY-leaningtech
enabled=1
baseurl=https://rpm.leaningtech.com/stable
EOF
```

And install the `cheerp-core` package:

```sh
yum install cheerp-core
```

Note that the nightly and stable repos are **NOT** compatible, so be sure to enable just one of them. Also, going from nightly to stable is always considered a downgrade by the package manager.
