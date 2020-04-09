import { CreateCollection } from './types';

export const createCollection = (
  param_object: CreateCollection['create_collection']['object'],
): CreateCollection => ({ create_collection: { object: param_object } });
