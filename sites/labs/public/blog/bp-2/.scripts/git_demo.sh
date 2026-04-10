set -x

rm -rf browserpod-meta
git clone https://github.com/leaningtech/browserpod-meta
cd browserpod-meta
cat <<EOF > demo.txt
Hello from the browser
EOF
git add demo.txt
git commit -m "committed from the web"
git --no-pager log -1
exec bash
