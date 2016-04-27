#!/bin/sh

SCRIPTDIR=$(cd "${0%/*}"; pwd)

if [ ! -e $SCRIPTDIR/node_modules/.bin/slc ] ; then
    echo "please run 'npm install strongloop' to install slc"
    exit
fi
if [ ! -e $HOME/.nvm ] ; then
    echo "please go to nvm.sh to install nvm"
    exit
fi

bash --init-file ./fp_profile
