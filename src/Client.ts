import crossFetch from 'cross-fetch';
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import urlParse from 'url-parse';
import { Expression, RequestResult } from './types';
import btoa from 'btoa-lite';

/**
 * The callback that will be executed after every completed request.
 */
export interface ClientObserver {
  (requestResult: RequestResult): void;
}

type ClientFetch = typeof crossFetch;

export interface ClientConfig {
  /** Domain of FaunaDB server. */
  domain?: string;
  /** Scheme of FaunaDB server. */
  scheme?: 'http' | 'https';
  /** Port of FaunaDB server. */
  port?: number;
  /** FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security)) */
  secret?: string;
  // https://github.com/steida/faunadb-js/issues/11
  // /** Read timeout in seconds. */
  // timeout?: number;
  observer?: ClientObserver;
  // I suppose it's better to inject custom fetch instead.
  // /**
  //  * For Node.js. Example:
  //  * `new (isHttps ? require('https') : require('http')).Agent({ keepAlive: true })`
  //  */
  // keepAliveEnabledAgent?: unknown;
  headers?: Record<string, string>;
  /** A fetch compatible [API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making a request */
  fetch?: ClientFetch;
}

/**
 * A client for interacting with FaunaDB.
 *
 * Users will mainly call the `query` method to execute queries.
 *
 * See the [FaunaDB Documentation](https://fauna.com/documentation) for
 * detailed examples.
 *
 * All methods return promises containing a JSON object that represents
 * the FaunaDB response. Literal types in the response object will remain
 * as strings, Arrays, and objects.
 * FaunaDB types, such as `Ref`, `SetRef`, `FaunaTime`, and `FaunaDate`
 * will be converted into the appropriate object.
 */
export class Client {
  static APIVersion = '2.7';

  /** URL for the FaunaDB server. */
  readonly baseUrl: string;

  // https://github.com/steida/faunadb-js/issues/11
  // /** Read timeout in milliseconds. */
  // readonly timeout: number;

  /** FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security)) */
  readonly secret?: string;

  readonly observer?: ClientObserver;

  readonly headers?: Record<string, string>;

  /** A fetch compatible [API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making a request */
  readonly fetch: ClientFetch;

  readonly lastSeen?: number = undefined;

  constructor({
    domain = 'db.fauna.com',
    scheme = 'https',
    port = scheme === 'https' ? 443 : 80,
    secret,
    // https://github.com/steida/faunadb-js/issues/11
    // timeout = 60,
    observer,
    headers,
    fetch = crossFetch,
  }: ClientConfig = {}) {
    this.baseUrl = `${scheme}://${domain}:${port}`;
    // https://github.com/steida/faunadb-js/issues/11
    // this.timeout = Math.floor(timeout * 1000);
    this.secret = secret;
    this.observer = observer;
    this.headers = headers;
    this.fetch = fetch;
  }

  /**
   * Executes a query via the FaunaDB Query API.
   * See the [docs](https://app.fauna.com/documentation/reference/queryapi),
   * and the query functions in this documentation.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  functionalQuery<R extends t.Any>(
    type: R,
    expression: Expression,
  ): TE.TaskEither<unknown, t.TypeOf<typeof type>> {
    const encodedExpression = Expression.encode(expression);
    // pipe? nebo await? pipe bere hodne, hmm, ok, pipe neni treba
    // return this.execute('POST')
    // expression encode a pak stringify a mam body
    // var startTime = Date.now()
    // _performRequest
    // var endTime = Date.now()
    // var responseText = response.text
    // var responseObject = json.parseJSON(responseText)

    // eslint-disable-next-line no-console
    console.log(encodedExpression);
    // Dev test.
    return TE.fromEither(
      type.decode({
        resource: {
          ref: {
            '@ref': {
              id: 'users',
              collection: { '@ref': { id: 'collections' } },
            },
          },
          ts: 1586353329640000,
          history_days: 30,
          name: 'users',
        },
      }),
    );
  }

  private getAuthorizationHeaders(): { Authorization: string } | null {
    if (this.secret == null) return null;
    return { Authorization: `Basic ${btoa(this.secret)}` };
  }

  // TODO: Handle errors.
  private execute(
    method: 'POST' | 'GET',
    {
      pathname = '',
      body = undefined,
    }: { pathname?: string; body?: string } = {},
  ): TE.TaskEither<unknown, string> {
    const url = urlParse(this.baseUrl);
    if (pathname) url.set('pathname', pathname);
    return TE.tryCatch(
      () =>
        this.fetch(url.href, {
          method,
          body,
          headers: {
            ...this.headers,
            ...this.getAuthorizationHeaders(),
            'X-FaunaDB-API-Version': Client.APIVersion,
            'X-Fauna-Driver': 'Javascript',
            // 'X-Last-Seen-Txn': this._lastSeen,
          },
        }).then((response) => response.text()),
      (error) => error,
    );
  }

  // TODO: query via functionalQuery
}
