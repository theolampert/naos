import express = require('express');
import test = require('tape');
import { run } from '../src';

const app = express();
const port = process.env.PORT || '3000';

const fixtures = {
  ok: '<html></html>',
  warning: '<html><script>console.warn("warning")</script></html>',
  exception: '<html><script>throw new Error("error text")</script></html>',
};

app.get('/200', (req, res) => {
  res.status(200);
  res.send(fixtures.ok);
});

app.get('/300', (req, res) => {
  res.status(300);
  res.send(fixtures.ok);
});

app.get('/400', (req, res) => {
  res.status(400);
  res.send(fixtures.ok);
});

app.get('/warning', (req, res) => {
  res.status(200);
  res.send(fixtures.warning);
});

app.get('/exception', (req, res) => {
  res.status(200);
  res.send(fixtures.exception);
});

const server = app.listen(port);

  run({
    protocol: 'http',
    host: '127.0.0.1',
    port,
    paths: [
      '/200',
      '/300',
      '/400',
      '/warning',
      '/exception',
    ],
  }, 'json').then((result) => {

    server.close();
    const r = JSON.parse(result);

    test('handles responses correctly', (t) => {
      t.test('Handles 200', (assert) => {
        const index = 0;
        assert.equals(r[index].warnings.length, 0);
        assert.equals(r[index].exceptions.length, 0);
        assert.equals(r[index].status, 200);
        assert.end();
      });

      t.test('Handles 300', (assert) => {
        const index = 1;
        assert.equals(r[index].warnings.length, 0);
        assert.equals(r[index].exceptions.length, 0);
        assert.equals(r[index].status, 300);
        assert.end();
      });

      t.test('Handles 400', (assert) => {
        const index = 2;
        assert.equals(r[index].warnings.length, 0);
        assert.equals(r[index].exceptions.length, 0);
        assert.equals(r[index].status, 400);
        assert.end();
      });

      t.test('handles browser warnings', (assert) => {
        const index = 3;
        assert.equals(r[index].warnings.length, 1);
        assert.equals(r[index].exceptions.length, 0);
        assert.equals(r[index].status, 200);
        assert.equals(r[index].warnings[0], 'warning');
        assert.end();
      });

      t.test('handles browser errors', (assert) => {
        const index = 4;
        assert.equals(r[index].warnings.length, 0);
        assert.equals(r[index].exceptions.length, 1);
        assert.equals(r[index].status, 200);
        assert.equals(r[index].exceptions[0], 'Error: Error: error text\n    at http://127.0.0.1:3000/exception:1:21');
        assert.end();
      });

      t.end();
      process.exit();
    });
  });
