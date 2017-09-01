import getReducer, { getActionType } from '../src/getReducer';
import { SPLIT } from '../src/constants';

describe('getActionType', () => {
  test('one-param', () => {
    const reducerKey = 'counter';
    const reducerName = 'increment';
    const expected = reducerKey + SPLIT + reducerName;
    expect(getActionType(reducerKey, reducerName)).toBe(expected);
  });

  test('two params', () => {
    const reducerKey = 'counter2';
    const reducerName = 'increment2';
    const expected = reducerKey + SPLIT + reducerName;
    const func = getActionType(reducerKey);
    expect(func).toBeInstanceOf(Function);
    expect(func(reducerName)).toBe(expected);
  });
});

describe('getReducer', () => {
  test('invalid key or reducer name', () => {
    const model = { key: `invalid${SPLIT}key`, initialState: null };
    const model3 = {
      key: 'foo',
      [`reducer${SPLIT}name`]() {}
    };
    expect(() => {
      getReducer(model);
    }).toThrowError(`state key:"${model.key}" must be a string and can not contain "${SPLIT}"`);
    expect(() => {
      getReducer({ key: '' });
    }).toThrowError(`state key:"" must be a string and can not contain "${SPLIT}"`);
    expect(() => {
      getReducer(model3);
    }).toThrowError(`reducer "reducer${SPLIT}name" at "${model3.key}" can not contain "${SPLIT}"`);
  });
});
