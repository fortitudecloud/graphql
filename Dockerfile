FROM amble/nodemonjs7-pi

COPY ./ /

#RUN npm i typescript -g

WORKDIR /
#RUN npm i
#RUN tsc -p ./src

EXPOSE 3001

CMD [ "npm", "run", "start" ]