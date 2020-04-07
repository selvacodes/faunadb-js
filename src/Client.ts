import { RequestResult } from './types';
import fetch from 'cross-fetch';

/**
 * The callback that will be executed after every completed request.
 */
export interface ClientObserver {
  (requestResult: RequestResult): void;
}

/**
 * A client for interacting with FaunaDB.
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
  }: {
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
  } = {}) {
    this.baseUrl = `${scheme}://${domain}:${port}`;
    this.timeout = Math.floor(timeout * 1000);
    this.secret = secret;
    this.observer = observer;
    this.headers = headers;
    this.keepAliveEnabledAgent = keepAliveEnabledAgent;
    this.customFetch = customFetch;
  }
}
