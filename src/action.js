import { SPLIT } from './constants';

export default class Action {
  constructor(key, actionName, payload, error, meta) {
    this.type = key + SPLIT + actionName;
    this.payload = payload;
    this.error = error;
    this.meta = meta;
  }
  matchType(key, actionName) {
    return (key + SPLIT + actionName) === this.type;
  }
}
