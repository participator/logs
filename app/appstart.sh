#!/bin/sh
# instructs which shell to use to run script with
npm install
npm run web &
npm run db &
mongod --dbpath="data/db"