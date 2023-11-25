FROM node:18-alpine as builder
WORKDIR /app
ARG MAPS_API_KEY
ENV VITE_MAPS_API_KEY $MAPS_API_KEY
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build



FROM nginx:1.19.0
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]


