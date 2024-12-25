import { toFullName } from './employees';

describe('toFullName()', () => {
  it('returns "Doe, John" from { lastName: "Doe", firstName: "John" }', () => {
    expect(toFullName({ lastName: 'Doe', firstName: 'John' })).toEqual('Doe, John');
  });

  it('returns "John" from { firstName: "John" }', () => {
    expect(toFullName({ firstName: 'John' })).toEqual('John');
  });
});
