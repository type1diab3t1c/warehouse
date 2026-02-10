FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site files
COPY site/ /usr/share/nginx/html/

# Copy photos into images directory
COPY ["pics/iCloud Photos from David Braga/", "/usr/share/nginx/html/images/"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
