### Naos ✨ ⛵️
Dead simple command line monitoring and debugging tool, based on [Puppeteer](https://github.com/GoogleChrome/puppeteer).

### Whats it do?
Specify an array of urls to scrape and naos will run them through Puppeteer, returning you a status code 
and any console warnings or errors it finds.

### Why?
Puppeteer is awesome and allows you to build very advanced integration test suites, however sometimes you 
don't need or don't have time to write anything more advanced than making sure your routes return a `200` and 
the console doesn't throw any errors.

### Installation
```sh
npm install -g naos
```

### Running
```sh
naos --config ./config.json
```

##### With JSON output
```sh
naos --config ./config.json --format json
```
