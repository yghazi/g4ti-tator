# g4ti-tator
This is the front-end of an annotation tool that allows you to annotate text documents with threat intelligence vocabulary, which is saved into a dataset. This dataset is later used to train an NER model which tags documents to extract high-level threat intelligence indicators like Actor, Targeted Application, Targeted Location, TTPs, etc.

## Configuration #

### Clone git repo ###
Repo for backend:
```
git clone https://github.com/yghazi/g4ti-nlp-processor.git
```
Clone this repo:
```
git clone https://github.com/yghazi/g4ti-tator.git
```
### Requirements 
- [Nodejs](https://nodejs.org/en/)
- [Http Server](https://www.npmjs.com/package/http-server) [or any web server you prefer]

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
### Install nodejs (Windows) ###
There's an installer for Windows that sets up nodejs globally. Make sure you use the NodeJS bash console for executing all the following commands in it.

### Install http-server and bower globally ###
```
#!bash
npm install -g http-server

npm install -g bower

```

### Install tator deps using bower ###

```
#!bash
cd g4ti-tator # navigate to the tator directory

bower install
```
### Run tator front-end ###
Once all the requirements have been installed, you can now run the front-end server with the following command. 
```
#!bash

http-server -p 8090
```
Now, in your browser, navigate to `localhost:8090` to view the home page.
