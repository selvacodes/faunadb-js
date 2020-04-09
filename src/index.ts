import { Client } from './Client';
import * as query from './query';
import * as types from './types';

export { Client, query, types };

// For some reason, `export * as query from './query';` does not work with Next.js.
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#-export--as-ns-syntax
// https://github.com/zeit/next.js/issues/11762
