import { Client, query as q, types } from 'faunadb-js-steida';
import React, { useEffect } from 'react';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { absurd } from 'fp-ts/lib/function';

const client = new Client({
  // TODO: Explain how to create Fauna test DB and get its key secret.
  secret: '',
});

const Home = () => {
  const runSomeQueriesWithAsyncAwait = async () => {
    // Note client.query returns TaskEither which has to be run to return Promise.
    // That's how we can create several TaskEither's to run them later, for example.
    // Response is Either. We can use isLeft, isRight, or pipe it.
    const response = await client.query(
      types.Collection,
      q.createCollection({ name: 'a' }),
    )();
    if (E.isLeft(response)) {
      // Log error.
      console.log(response.left);
    } else {
      // Log created collection name. Note everything is safely typed.
      console.log(response.right.name);
    }

    // Delete collection.
    await client.query(types.Collection, q.delete_(q.collection('a')))();
  };

  const runSomeQueriesWithPipe = pipe(
    client.query(types.Collection, q.createCollection({ name: 'b' })),
    TE.chain(() =>
      client.query(types.Collection, q.delete_(q.collection('b'))),
    ),
  );

  const runSomeQueries = async () => {
    await runSomeQueriesWithAsyncAwait();

    runSomeQueriesWithPipe().then((response) =>
      pipe(
        response,
        E.fold(
          (error) => {
            // Note all errors have to be handled. It's ensured via absurd.
            // https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
            switch (error.type) {
              case 'FaunaDecodeError':
                console.log(error.errors);
                break;
              case 'FaunaFetchError':
                console.log(error.message);
                break;
              case 'FaunaHttpErrors':
                console.log(error.errors);
                break;
              case 'FaunaUnknownHttpErrors':
                console.log(error.errors);
                break;
              default:
                absurd(error);
            }
          },
          (result) => {
            // Log created collection name. Note everything is safely typed.
            console.log(result.name);
          },
        ),
      ),
    );
  };

  useEffect(() => {
    runSomeQueries();
  }, []);

  return <div>Basic</div>;
};

export default Home;
