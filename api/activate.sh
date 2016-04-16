#!/bin/sh

SCRIPTDIR=$(cd "${0%/*}"; pwd)

if [ ! -e $SCRIPTDIR/node_modules/.bin/slc ] ; then
    echo "please run 'npm install strongloop' to install slc"
    exit
fi

export PATH=$SCRIPTDIR/node_modules/.bin/:$PATH
echo "$SCRIPTDIR/node_modules/.bin/ added to PATH"
echo "ctrl-d or exit to quit"

export PS1="(activated)\w\$ "

bash
