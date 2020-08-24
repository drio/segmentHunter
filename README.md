![](demo.2.gif)

### Intro

StravaHunter is a webapp that helps you identify what Strava segments are ideal for attempting a
PR or KOM given the current weather conditions.

It is still in heavy development.

### Usage

The oauth process is not automated yet so we pull Strava data manually.

Here is the process.

First, let's run through the oauth process (manually) to get our API token.
Take a look to the scripts/oauth to adjust the env variables to your context.
Don't worry, this will change as soon as you implement the oauth process in
the client.

```
$ cd scripts/oauth
$ ./step1.sh
...
$ ./step2.sh
```

Now, we generate the weather data. Checkout the `makefile` to update your
location.

```
$ cd data/weather
$ make
...
$ ls
Makefile        hourly.json     weather.json
```

Then, we get our starred segments from Strava:

```
$ cd ../segments
$ make
$ make all.json
```

At this point you should have the details of your starred segments in `./details`.

Now we can move to the client.

```
$ cd stravaHunter/client
$ cat config.json
{
  "development": {
      "MAPBOX_TOKEN": "xxx"
  }
}

$ npm i
$ npm run dev
```

And point your browser to localhost:3000.
