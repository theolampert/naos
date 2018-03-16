import express from 'express';
import { test } from 'tape';
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

    test('handles 200 response correctly', (t) => {
      t.equals(r[0].warnings.length, 0);
      t.equals(r[0].exceptions.length, 0);
      t.equals(r[0].status, 200);

      t.end();
    });

    test('handles 300 response correctly', (t) => {
      t.equals(r[1].warnings.length, 0);
      t.equals(r[1].exceptions.length, 0);
      t.equals(r[1].status, 300);

      t.end();
    });

    test('handles 400 response correctly', (t) => {
      t.equals(r[2].warnings.length, 0);
      t.equals(r[2].exceptions.length, 0);
      t.equals(r[2].status, 400);

      t.end();
    });

    test('handles browser warning response correctly', (t) => {
      t.equals(r[3].warnings.length, 1);
      t.equals(r[3].exceptions.length, 0);
      t.equals(r[3].status, 200);
      t.equals(r[3].warnings[0], 'warning');

      t.end();
    });

    test('handles browser error response correctly', (t) => {
      t.equals(r[4].warnings.length, 0);
      t.equals(r[4].exceptions.length, 1);
      t.equals(r[4].status, 200);

      t.equals(r[4].exceptions[0], 'Error: Error: error text\n    at http://127.0.0.1:3000/exception:1:21');

      t.end();

      process.exit();
    });
  });
