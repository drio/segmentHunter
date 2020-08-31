# Production setup process

## nginx setup

`$ sudo certbot --nginx -d segmenthunter.net -d www.segmenthunter.net`

In, `/etc/nginx/sites-available` add a file `segmenthunter.net`:

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
