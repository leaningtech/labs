#!/bin/bash

DEFAULT_REPO="https://github.com/leaningtech/browserpod-meta"

while true; do
	read -r -p $'\nGitHub repository URL (Enter for default): ' repo_url
	if [ -z "$repo_url" ]; then
		repo_url="$DEFAULT_REPO"
	fi

	rm -rf repository
	if ! git clone "$repo_url" repository; then
		echo "Clone failed. Try another URL."
		continue
	fi

	pushd .
	cd repository
	git show -p
	popd

	read -r -p $'\nRun again? (y/n) ' again

	if [ "$again" != "y" ] && [ "$again" != "Y" ]; then
		break
	fi
done

exec bash