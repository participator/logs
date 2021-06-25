# Log Web Application
This is a node web app which displays user's daily accomplishments.  This will make it easy for people to track their accomplishments by having a common place to add and share them with your network(s).

## Installation
npm install

cd app

./appstart.sh

## Select database

### Local database
To run against a local MongoDB instance, in serverDB/dbConnect.js: 
1. Replace ```url_localhost``` with your local MongoDB connection string
1. Change '''url_current = url_localhost'''
1. Start local MongoDB instance

*This assumes that you have a local MongoDB instance created

### Cloud database
To run against a cloud MongoDB instance, in serverDB/dbConnect.js:
1. Replace ```url_atlas``` with your MongoDB connection string
1. Change ```url_current = url_atlas```

*This assumes that you have a cloud MongoDB instance created