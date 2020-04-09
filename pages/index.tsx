import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import { ReactNode, useEffect } from 'react';

// This is dev playground.
// import { Client, query as q } from 'faunadb';
import { Client, query as q, types } from '../src';

const testFauna = async (): Promise<void> => {
  const client = new Client({
    secret: 'fnADo6xlx5ACAA8eeCgfcfLaur_pfQtzs7-WerW4',
  });

  const Response = t.type({
    resource: types.Collection,
  });

  const response = await client.functionalQuery(
    Response,
    q.createCollection({ name: 'users' }),
  )();

  if (E.isRight(response)) {
    // eslint-disable-next-line no-console
    console.log(response.right.resource.ts.getDate());
  } else {
    // eslint-disable-next-line no-console
    console.log(response.left);
  }

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
};

const Home = (): ReactNode => {
  useEffect(() => {
    testFauna();
  }, []);
  return <div>playground</div>;
};

export default Home;
