FROM golang:1.15 as BUILD-BACKEND
RUN apt-get update && apt-get install sqlite3 -y && mkdir /db 
WORKDIR /src
COPY go.sum go.mod ./
RUN go mod download
COPY . .
RUN rm -fr ./frontend && rm -fr ./Documentation
RUN go build -a -ldflags "-linkmode external -extldflags '-static' -s -w" -o /bin/app .
#RUN CGO_ENABLED=0 go build -o /bin/backend .

FROM node:14.15.1 as BUILD-FRONTEND
WORKDIR /src
COPY frontend/package.json .
RUN npm install
COPY frontend .
RUN sed -i -e 's/\"proxy\": \"http:\/\/localhost:8080\",//g' package.json
RUN npm run build && cp -fr build /bin/


FROM nginx
WORKDIR /app
RUN mkdir build && mkdir db
COPY --from=BUILD-BACKEND /bin/app .
COPY --from=BUILD-FRONTEND /bin/build /usr/share/nginx/html
COPY entrypoint.sh .
COPY default.conf /etc/nginx/conf.d/default.conf
RUN chmod 777 entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
CMD [""]