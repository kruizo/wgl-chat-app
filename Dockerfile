FROM node:18 AS express
WORKDIR /app
COPY /backend/package.json /backend/package-lock.json .
RUN npm install
COPY ./backend .
EXPOSE 5000
CMD ["node", "server.js"]

FROM express AS websocket
WORKDIR /app
COPY /backend/package.json /backend/package-lock.json .
RUN npm install
COPY ./backend .
EXPOSE 5001
CMD ["node", "src/ws/index.js"]

FROM node:18 AS vite
WORKDIR /app
COPY /frontend/package.json /frontend/package-lock.json .
RUN npm install
COPY ./frontend .
RUN npm run build

FROM express AS websocket
WORKDIR /app
COPY /backend/package.json /backend/package-lock.json .
RUN npm install --include=dev
COPY ./backend .
EXPOSE 5001
CMD ["npx", "nodemon", "src/ws/index.js"]

FROM nginx:alpine AS nginx
WORKDIR usr/share/nginx
RUN rm -rf html/*
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 
COPY --from=vite /app/dist/ usr/share/nginxs/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
