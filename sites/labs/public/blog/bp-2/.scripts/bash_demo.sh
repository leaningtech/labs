set -x

xxd /bin/bash | head -1
seq 1 9 | paste - - -
echo 'scale=30; 4*a(1)' | bc -l

exec bash
