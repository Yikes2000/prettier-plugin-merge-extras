##
# Copy Babel tests into here.
##

TARGET=../../babel/extras

for dir in $( cd $TARGET ; find . -mindepth 1 -type d ) ; do

    if [ ! -e $dir ]; then
        mkdir $dir
    fi
        
    if [ ! -d $dir -o -L $dir ]; then
        echo "ERROR: $dir is not a directory"
        exit 1

    else
        cp -rv $TARGET/$dir/*.test.ts $dir
    fi
done

cp -f $TARGET/.prettierrc.json .
