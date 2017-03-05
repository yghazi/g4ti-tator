# Configuration #

### Linux Ubuntu ###

### Install nodejs ###

```
#!bash

apt-get update 

apt-get install node

```
### Install http-server and bower globally ###
```
#!bash
npm install -g http-server

npm install -g bower

```

### Install tator deps using bower ###

```
#!bash
cd tator

bower install
```
### Run tator front-end ###

```
#!bash

http-server -p 8090
```