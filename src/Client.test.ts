import { Client } from './Client';

test('it makes an instance', () => {
  const client = new Client();
  expect(client.a).toBe(1);
});
