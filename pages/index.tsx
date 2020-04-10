import * as E from 'fp-ts/lib/Either';
import { ReactNode, useEffect } from 'react';
// import { Client, query as q } from 'faunadb';
import { Client, query as q, types } from '../src';

const testFauna = async (): Promise<void> => {
  const client = new Client({
    secret: 'fnADo6xlx5ACAA8eeCgfcfLaur_pfQtzs7-WerW4',
  });

  const response = await client.functionalQuery(
    types.Collection,
    // q.createCollection({ name: 'a' }),
    q.delete_(q.collection('a')),
  )();
  // Just an example.
  if (E.isLeft(response)) {
    // eslint-disable-next-line no-console
    console.log(response.left);
  } else {
    // eslint-disable-next-line no-console
    console.log(response.right);
  }

  // {"resource":{"ref":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}},"ts":1586353329640000,"history_days":30,"name":"users"}}
  // {"errors":[{"position":["delete"],"code":"invalid ref","description":"Ref refers to undefined collection 'users'"}]}
  // const response = await client.query(q.CreateCollection({ name: 'c' }));
  // console.log(response);
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
