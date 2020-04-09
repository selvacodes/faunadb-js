import * as E from 'fp-ts/lib/Either';
import * as t from 'io-ts';

// Notes:
//  - We don't use branded types (like FaunaID, Days, etc.) for Fauna API,
//    because it would confuse people. To be reconsider later.
//  - We don't use t.strict, because it only removes props.

/**
 * Fauna Long type as JavaScript Date.
 */
const DateFromFaunaLong = new t.Type<Date, number, unknown>(
  // https://github.com/gcanti/io-ts-types/blob/master/src/DateFromUnixTime.ts
  'DateFromFaunaLong',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    E.either.chain(t.Int.validate(u, c), (n) => {
      const d = new Date(n / 1000);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => a.getTime() * 1000,
);

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

/**
 * The CreateCollection function is used to create a collection that groups
 * documents. Once the collection has been created, it is possible to create
 * documents within the collection. You cannot create a collection and insert
 * documents into that collection in the same transaction.
 */
export const CreateCollection = t.type({
  create_collection: t.type({
    // That's how we create optional fields with io-ts.
    object: t.intersection([
      // Required.
      t.type({
        /**
         * The name of the collection. Collections cannot be named any of
         * the following reserved words: events, set, self, documents, or _.
         */
        name: t.string,
      }),
      // Optional.
      t.partial({
        /**
         * This is user-defined metadata for the collection. It is provided
         * for the developer to store information at the collection level.
         */
        data: t.UnknownRecord,
        /**
         * The number of days that document history is retained for in this
         * collection. The default is 30 days.
         * Not setting history_days retains this collection’s history forever.
         * Setting history_days to 0 retains only the current version of each
         * document in this collection; no history is retained.
         */
        history_days: t.number,
        /**
         * The number of days documents are retained for this collection.
         * Documents which have not been updated within the configured TTL duration
         * are removed. Not setting ttl_days retains documents forever.
         */
        ttl_days: t.number,
        // TODO:
        // permissions: Permissions
      }),
    ]),
  }),
});
export type CreateCollection = t.TypeOf<typeof CreateCollection>;

// TODP: Refactor to generic Ref probably.
export const CollectionRef = t.type({
  '@ref': t.type({
    id: t.string,
    collection: t.type({
      '@ref': t.type({ id: t.literal('collections') }),
    }),
  }),
});
export type CollectionRef = t.TypeOf<typeof CollectionRef>;

export const Collection = t.type({
  ref: CollectionRef,
  ts: DateFromFaunaLong,
  history_days: t.number,
  name: t.string,
});
export type Collection = t.TypeOf<typeof Collection>;
