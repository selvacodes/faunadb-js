import { RequestResult, CreateCollection } from './types';
import * as t from 'io-ts';
import fetch from 'cross-fetch';

/**
 * The callback that will be executed after every completed request.
 */
export interface ClientObserver {
  (requestResult: RequestResult): void;
}

export interface ClientConfig {
  /** Domain of FaunaDB server. */
  domain?: string;
  /** Scheme of FaunaDB server. */
  scheme?: 'http' | 'https';
  /** Port of FaunaDB server. */
  port?: number;
  /** FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security)) */
  secret?: string;
  /** Read timeout in seconds. */
  timeout?: number;
  observer?: ClientObserver;
  /**
   * For Node.js. Example:
   * `new (isHttps ? require('https') : require('http')).Agent({ keepAlive: true })`
   */
  keepAliveEnabledAgent?: unknown;
  headers?: Record<string, string>;
  /** A fetch compatible [API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making a request */
  customFetch?: typeof fetch;
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

  /** Read timeout in milliseconds. */
  readonly timeout: number;

  /** FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security)) */
  readonly secret?: string;

  readonly observer?: ClientObserver;

  /**
   * For Node.js. Example:
   * `new (isHttps ? require('https') : require('http')).Agent({ keepAlive: true })`
   */
  readonly keepAliveEnabledAgent?: unknown;

  readonly headers?: Record<string, string>;

  /** A fetch compatible [API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making a request */
  readonly customFetch?: typeof fetch;

  readonly lastSeen?: number = undefined;

  constructor({
    domain = 'db.fauna.com',
    scheme = 'https',
    port = scheme === 'https' ? 443 : 80,
    secret,
    timeout = 60,
    observer,
    keepAliveEnabledAgent,
    headers,
    customFetch = fetch,
  }: ClientConfig = {}) {
    this.baseUrl = `${scheme}://${domain}:${port}`;
    this.timeout = Math.floor(timeout * 1000);
    this.secret = secret;
    this.observer = observer;
    this.headers = headers;
    this.keepAliveEnabledAgent = keepAliveEnabledAgent;
    this.customFetch = customFetch;
  }

  /**
   * Executes a query via the FaunaDB Query API.
   * See the [docs](https://app.fauna.com/documentation/reference/queryapi),
   * and the query functions in this documentation.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  functionalQuery(type: t.Any, expression: CreateCollection): Promise<unknown> {
    throw '';
  }

  // TODO: query via functionalQuery
}
