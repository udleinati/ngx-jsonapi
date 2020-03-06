FROM ubuntu:18.04 AS node

RUN apt-get update && apt-get install -y openssh-server openssh-client git curl nano build-essential sudo

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN apt-get update && apt-get install -y nodejs

RUN npm install -g npm

RUN useradd -ms /bin/bash deploy && echo deploy:passworddeploy | chpasswd –crypt-method=SHA512 && adduser deploy sudo
USER deploy
WORKDIR /home/deploy

#COPY package*.json ./

#RUN npm i

ENV APP_PATH /home/deploy/ngx-jsonapi
SHELL ["/bin/bash", "-l", "-c"]
RUN mkdir -p $APP_PATH

WORKDIR $APP_PATH
