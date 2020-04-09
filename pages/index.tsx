import * as t from 'io-ts';
import { ReactNode, useEffect } from 'react';

// This is dev playground.
// import { Client, query as q } from 'faunadb';
import { Client, query as q, types } from '../src';

const testFauna = async (): Promise<void> => {
  const client = new Client({
    secret: 'fnADo6xlx5ACAA8eeCgfcfLaur_pfQtzs7-WerW4',
  });

  // await client.query(q.CreateCollection({ name: 'users' }));

  // // Data sent to the server.
  // const a: t.OutputOf<typeof types.CreateCollection> = {
  //   create_collection: { object: { name: 'users' } },
  // };
  // const e = types.CreateCollection.decode(a);
  // console.log(e._tag === 'Right'); // true

  // Data returned from the server.
  const a = {
    resource: {
      ref: {
        '@ref': { id: 'users', collection: { '@ref': { id: 'collections' } } },
      },
      ts: 1586353329640000,
      history_days: 30,
      name: 'users',
    },
  } as const;
  const c: t.OutputOf<typeof types.Collection> = a.resource;
  // const collection: t.OutputOf<typeof types.Collection> = a.resource;
  const e = types.Collection.decode(c);
  // eslint-disable-next-line no-console
  console.log(e._tag === 'Right'); // true

  // Error returned from the server.
  // const a = {
  //   errors: [
  //     {
  //       position: ['create_collection'],
  //       code: 'validation failed',
  //       description: 'document data is not valid.',
  //       failures: [
  //         {
  //           field: ['name'],
  //           code: 'duplicate value',
  //           description:
  //             'Value is cached. Please wait at least 60 seconds after creating or renaming a collection or index before reusing its name.',
  //         },
  //       ],
  //     },
  //   ],
  // };
  await client.query(q.createCollection({ name: 'users' }));
  await Promise.resolve();
};

const Home = (): ReactNode => {
  useEffect(() => {
    testFauna();
  }, []);
  return <div>playground</div>;
};

export default Home;
