import * as E from 'fp-ts/lib/Either';
import { ReactNode, useEffect } from 'react';
// import { Client, query as q } from 'faunadb';
import { Client, query as q, types } from '../src';

const testFauna = async (): Promise<void> => {
  const client = new Client({
    secret: 'fnADo6xlx5ACAA8eeCgfcfLaur_pfQtzs7-WerW4',
  });

  const response = await client.query(
    types.Collection,
    // q.createCollection({ name: 'a' }),
    q.delete_(q.collection('a')),
  )();

  // await client.query(
  //   q.Create(q.Collection('users'), {
  //     credentials: { password: 'aaaaa' },
  //     data: { email: 'a@a.com' },
  //   }),
  // );

  // Just an example.
  if (E.isLeft(response)) {
    // eslint-disable-next-line no-console
    console.log(response.left);
  } else {
    // eslint-disable-next-line no-console
    console.log(response.right);
  }

  // TOHLE!
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
};

const Home = (): ReactNode => {
  useEffect(() => {
    testFauna();
  }, []);
  return <div>playground</div>;
};

export default Home;
