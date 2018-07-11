# g4ti-tator
This is the front-end of an annotation tool that allows you to annotate text documents with threat intelligence vocabulary, which is saved into a dataset. This dataset is later used to train an NER model which tags documents to extract high-level threat intelligence indicators like Actor, Targeted Application, Targeted Location, TTPs, etc.

## Configuration #

### Clone git repo ###
```
git clone https://github.com/yghazi/g4ti-tator.git
```

### Install nodejs (ubuntu) ###

```
#!bash

apt-get update 

apt-get install node

```
### Install nodejs (mac) ###
```
#!bash

brew update

brew install node

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
