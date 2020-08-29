# Production setup process

## nginx setup

`$ sudo certbot --nginx -d segmenthunter.net -d www.segmenthunter.net`

In, `/etc/nginx/sites-available` add a file `segmenthunter.net`:

```
server {
  root /var/www/segmenthunter.net;
  server_name segmenthunter.net;

  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }

  listen 443 ssl;
 	# START managed by Certbot
  ssl_certificate /etc/letsencrypt/live/segmenthunter.net/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/segmenthunter.net/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
 	# END managed by Certbot
}
```

Check the pem files to make sure they are there.
And create the directories:

```
$ cd /var/www
$ sudo mkdir segmenthunter.net
$ sudo chown -R ubuntu:ubuntu segmenthunter.net
$ echo 'segmenthunter.net' >  segmenthunter.net/index.html
```

```
$ sudo ln -s /etc/nginx/sites-available/segmenthunter.net /etc/nginx/sites-enabled/segmenthunter.net
$ sudo systemctl restart nginx.service
```
