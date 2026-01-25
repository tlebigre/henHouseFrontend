[![en](https://img.shields.io/badge/lang-en-ab4b52.svg)](https://github.com/tlebigre/henhouse-app/blob/main/README.md)
[![fr](https://img.shields.io/badge/lang-fr-318ce7.svg)](https://github.com/tlebigre/henhouse-app/blob/main/README.fr.md)

|                                                    Henhouse                                                    |                                                   Cameras                                                    |                                               Real buttons                                                |
| :------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/tlebigre/henhouse-app/blob/main/en_henhouse.jpg" alt="" width="300" height="600"> | <img src="https://github.com/tlebigre/henhouse-app/blob/main/en_camera.jpg" alt="" width="300" height="600"> | <img src="https://github.com/tlebigre/henhouse-app/blob/main/upDown.jpg" alt="" width="120" height="200"> |

# Hen house frontend

> :warning: **_This application work only if [henHouseBackendApi](https://github.com/tlebigre/henHouseBackendApi) run !_**

This is front application for henHouseBackendApi project.

## Developing
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

    location /henhouse/ {
        proxy_pass http://127.0.0.1:8085/;
        proxy_http_version 1.1;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /camera/ {
        proxy_pass http://127.0.0.1:8085/;
        proxy_http_version 1.1;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
