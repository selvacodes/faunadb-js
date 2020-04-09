import { CollectionRef, CreateCollection, Delete } from './types';

export const createCollection = (
  param_object: CreateCollection['create_collection']['object'],
): CreateCollection => ({ create_collection: { object: param_object } });

/**
 * The Collection function returns a valid Reference for the specified
 * collection name, in the specified child database. If a child database
 * is not specified, the returned collection reference belongs to the
 * current database.
 */
export const collection = (name: string): CollectionRef => ({
  '@ref': {
    id: name,
    collection: {
      '@ref': { id: 'collections' },
    },
  },
});

/**
 * https://docs.fauna.com/fauna/current/api/fql/functions/delete
 * delete_ with underscore suffix, becase it's reverved word.
 */
export const delete_ = (ref: CollectionRef): Delete => ({
  delete: { collection: ref['@ref'].id },
});
