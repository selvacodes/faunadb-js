import btoa from 'btoa-lite';
import crossFetch from 'cross-fetch';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import urlParse from 'url-parse';
import { Expression, FaunaError, RequestResponse } from './types';

/**
 * The callback that will be executed after every completed request.
 */
type ClientObserver = (requestResponse: RequestResponse) => void;

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

  static headersToRecord = (headers: Headers): Record<string, string> => {
    const record: Record<string, string> = {};
    for (const [key, value] of headers.entries()) record[key] = value;
    return record;
  };

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
    const body = JSON.stringify(encodedExpression);

    // TODO: Pipe.
    this.performRequest('POST', { body })().then((response) => {
      // eslint-disable-next-line no-console
      console.log(response);
    });

    // eslint-disable-next-line no-console
    // console.log(encodedExpression);
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

  // /**
  //  * Sends a `ping` request to FaunaDB.
  //  * @return {external:Promise<string>} Ping response.
  //  */
  // Client.prototype.ping = function(scope, timeout) {
  // return this._execute('GET', 'ping', null, { scope: scope, timeout: timeout })
  // }

  private getAuthorizationHeaders(): { Authorization: string } | null {
    if (this.secret == null) return null;
    return { Authorization: `Basic ${btoa(this.secret)}` };
  }

  private performRequest(
    method: RequestResponse['method'],
    {
      body = undefined,
      path = '',
    }: {
      body?: string;
      path?: string;
      // TODO: query
    } = {},
  ): TE.TaskEither<FaunaError, RequestResponse> {
    const url = urlParse(this.baseUrl);
    url.set('pathname', path);
    // TODO: url.set('query', query)
    const startTime = Date.now();

    return pipe(
      TE.tryCatch<
        FaunaError,
        {
          endTime: number;
          headers: Record<string, string>;
          status: number;
          json: unknown;
        }
      >(
        () =>
          this.fetch(url.href, {
            method,
            body,
            headers: {
              ...this.headers,
              ...this.getAuthorizationHeaders(),
              'X-FaunaDB-API-Version': Client.APIVersion,
              'X-Fauna-Driver': 'Javascript',
              // TODO: 'X-Last-Seen-Txn': this._lastSeen,
            },
          }).then((response) => {
            const endTime = Date.now();
            return response.json().then((json) => ({
              endTime,
              headers: Client.headersToRecord(response.headers),
              status: response.status,
              json,
            }));
          }),
        (error) => ({ type: 'FaunaFetchError', message: String(error) }),
      ),
      TE.chain(({ endTime, headers, status, json }) => {
        // https://github.com/steida/faunadb-js/issues/12
        // if (status < 200 || status >= 300) {
        if (status >= 400) {
          switch (status) {
            case 400:
              // TODO: Decode
              return TE.left({ type: 'FaunaHttpError' });
            // case 401:
            //   throw new Unauthorized(requestResult);
            // case 403:
            //   throw new PermissionDenied(requestResult);
            // case 404:
            //   throw new NotFound(requestResult);
            // case 405:
            //   throw new MethodNotAllowed(requestResult);
            // case 500:
            //   throw new InternalError(requestResult);
            // case 503:
            //   throw new UnavailableError(requestResult);
            // default:
            //   throw new FaunaHTTPError('UnknownError', requestResult);
          }
        }
        return TE.right({
          method,
          path,
          statusCode: status,
          responseHeaders: headers,
          startTime,
          endTime,
          timeTaken: endTime - startTime,
          request: body,
          response: json,
        });
      }),
    );
  }

  // TODO: query via functionalQuery
}
