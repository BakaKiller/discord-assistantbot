FROM node:buster-slim

RUN apt-get update && apt-get install git default-mysql-client -y
RUN git clone https://github.com/BakaKiller/discord-assistantbot.git /var/lib/discord-assistantbot

WORKDIR /var/lib/discord-assistantbot
COPY ./startscript /usr/local/bin/startscript
RUN echo "{}" > /var/lib/discord-assistantbot/config.json

RUN chmod +x ./bot.js ./installdb /usr/local/bin/startscript

RUN npm install

ENTRYPOINT ["/usr/local/bin/startscript"]
CMD /var/lib/discord-assistantbot/bot.js