import * as t from 'io-ts';

/**
 * A structure containing the request and response context for a given FaunaDB
 * request. Provided to an observer function optionally defined in the
 * `Client` constructor.
 */
export const RequestResult = t.type({
  /** The HTTP method used in the request. */
  method: t.keyof({
    GET: null,
    POST: null,
    PUT: null,
    PATCH: null,
    DELETE: null,
  }),
  /** The path that was queried. Relative to the client's domain. */
  path: t.string,
  /** URL query parameters. Only set if `method` is "GET". */
  query: t.union([t.string, t.null]),
  /** The JSON request string. */
  requestRaw: t.string,
  /** The request data. */
  requestContent: t.UnknownRecord,
  /** The unparsed response data, as a string. */
  responseRaw: t.string,
  /** The response data parsed as JSON. */
  responseContent: t.UnknownRecord,
  /** The HTTP response status code. */
  statusCode: t.number,
  /** The HTTP headers returned in the response. */
  responseHeaders: t.UnknownRecord,
  /** The time the request was issued by the client. */
  startTime: t.number,
  /** The time the response was received by the client. */
  endTime: t.number,
});

export type RequestResult = t.TypeOf<typeof RequestResult>;
