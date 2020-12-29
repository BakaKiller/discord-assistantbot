FROM node:buster-slim

RUN apt-get update && apt-get install git default-mysql-client -y
RUN git clone https://github.com/BakaKiller/discord-assistantbot.git /var/lib/discord-assistantbot

WORKDIR /var/lib/discord-assistantbot
COPY ./startscript /usr/local/bin/startscript
RUN ["echo", "'{}'", ">", "./config.json"]

RUN chmod +x ./bot.js ./installdb /usr/local/bin/startscript

RUN npm install

RUN ln -snf /usr/share/zoneinfo/${config_timezone} /etc/localtime && echo ${config_timezone} > /etc/timezone

ENTRYPOINT ["/usr/local/bin/startscript"]
CMD /var/lib/discord-assistantbot/bot.js