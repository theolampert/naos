### Naos ✨ ⛵️
Dead simple command line monitoring and debugging tool, based on [Puppeteer](https://github.com/GoogleChrome/puppeteer).

### Whats it do?
Specify an array of urls to scrape and naos will evaluate them through Puppeteer, returning you a status code
and any browser console warnings or errors it finds.

### Why?
Puppeteer is awesome and allows you to build very advanced integration test suites, however sometimes you
don't need or don't have time to write anything more advanced than making sure your routes return a `200` and
the console doesn't throw any errors. This can be very useful as a quick and basic regression checking tool.

### Installation
```sh
npm install -g naos
```

### Running

First create a config.json file like so:
```json
{
  "protocol": "https",
  "host": "www.nytimes.com",
  "port": 443,

  "paths": [
    "/",
    "/section/world/"
  ]
}

```

And begin scraping:

```sh
naos --config ./config.json
```

