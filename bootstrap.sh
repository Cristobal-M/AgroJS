#!/bin/bash

# pkgs="apache2 mongodb curl build-essential"
pkgs="mongodb build-essential"
updated=false


apt-get install curl

result=
if [ `dpkg --get-selections | grep "^nodejs[[:space:]]*install$"`="" ]; then
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    sudo apt-get install -y nodejs
    updated=true
fi

for pkg in $pkgs; do
    if [ `dpkg --get-selections | grep "^nodejs[[:space:]]*install$"`="" ]; then
        echo -e "$pkg is already installed"
    else
        if [ !$updated ]; then
            sudo apt-get update
            updated=true
        fi
        #echo "Successfully installed $pkg"
        sudo apt-get install -y $pkg
    fi
done




#Symlink to project in apache
# if ! [ -L /var/www ]; then
#   rm -rf /var/www
#   ln -fs /vagrant /var/www
# fi