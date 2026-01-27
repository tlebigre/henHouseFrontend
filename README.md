[![en](https://img.shields.io/badge/lang-en-ab4b52.svg)](https://github.com/tlebigre/henhouse-app/blob/main/README.md)
[![fr](https://img.shields.io/badge/lang-fr-318ce7.svg)](https://github.com/tlebigre/henhouse-app/blob/main/README.fr.md)

|                                                    Henhouse                                                    |                                                   Cameras                                                    |                                               Real buttons                                                |
| :------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/tlebigre/henhouse-app/blob/main/en_henhouse.jpg" alt="" width="300" height="600"> | <img src="https://github.com/tlebigre/henhouse-app/blob/main/en_camera.jpg" alt="" width="300" height="600"> | <img src="https://github.com/tlebigre/henhouse-app/blob/main/upDown.jpg" alt="" width="120" height="200"> |

# Hen house frontend

> :warning: **_This application work only if [henHouseBackendApi](https://github.com/tlebigre/henHouseBackendApi) run !_**

This is front application for henHouseBackendApi project.

## Developing

## /etc/nginx/sites-available/henhouse
```bash
server {
    listen 80;
    server_name _;

    root /var/www/henhouse;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location /henHouse/ {
        proxy_pass http://127.0.0.1:8085/henHouse/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /camera/ {
        proxy_pass http://127.0.0.1:8085/camera/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /opening/ {
        proxy_pass http://127.0.0.1:8085/opening/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
