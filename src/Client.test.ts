import { Client } from './Client';
import fetch from 'cross-fetch';

test('default instance', () => {
  const client = new Client();
  expect(client.lastSeen).toBeUndefined();
  expect(client.baseUrl).toBe('https://db.fauna.com:443');
  expect(client.timeout).toBe(60000);
  expect(client.secret).toBeUndefined();
  expect(client.observer).toBeUndefined();
  expect(client.headers).toBeUndefined();
  expect(client.keepAliveEnabledAgent).toBeUndefined();
  expect(client.customFetch).toBe(fetch);
});

test('custom domain', () => {
  const client = new Client({ domain: 'db.flora.com' });
  expect(client.baseUrl).toBe('https://db.flora.com:443');
});

test('custom scheme', () => {
  const client = new Client({ scheme: 'http' });
  expect(client.baseUrl).toBe('http://db.fauna.com:80');
});

test('custom secret', () => {
  const client = new Client({ secret: '123' });
  expect(client.secret).toBe('123');
});
