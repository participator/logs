# Log Dockerfile
# FROM node:13 AS Log_WebServer
# add files, 
# setting env variable
# specifying cmd that gets run once container is up
FROM node:13
# Copy local /app into container's /app folder
# Relative to where the dockerfile is
COPY app /app
WORKDIR /app
# Sets the executed permission by default
RUN chmod +x appstart.sh
CMD /appstart.sh