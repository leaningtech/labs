#!/bin/sh
# Compile for Java 8 bytecode: CheerpJ's default (and smallest) runtime is Java 8,
# and --release 8 also keeps string concatenation as plain StringBuilder calls
# instead of invokedynamic, which would pull in the whole java.lang.invoke machinery.
set -e
cd "$(dirname "$0")"

# Forms draws text from a table of pre-rendered Liberation Sans glyphs (the font CheerpJ uses),
# generated here, so it doesn't have to start Java's font system before its first frame.
FONTS=${FONTS:-/usr/share/fonts/liberation-sans-fonts}
rm -rf gen && mkdir -p gen/tool
javac -d gen/tool tools/GlyphGen.java
java -Djava.awt.headless=true -cp gen/tool GlyphGen gen/Glyphs.java \
  "$FONTS/LiberationSans-Regular.ttf" "$FONTS/LiberationSans-Bold.ttf"
# The same at 24px for HiDPI screens (Forms draws at 2x when devicePixelRatio >= 1.5).
java -Djava.awt.headless=true -cp gen/tool GlyphGen gen/Glyphs2.java \
  "$FONTS/LiberationSans-Regular.ttf" "$FONTS/LiberationSans-Bold.ttf" Glyphs2 24

rm -rf out && mkdir -p out
javac --release 8 -g:none -d out -sourcepath gen src/*.java
# The page runs Forms.main; java -jar opens the form in an AWT window (FormsDesktop).
jar --create --file forms.jar --main-class FormsDesktop -C out .
rm -rf out gen
ls -l forms.jar
