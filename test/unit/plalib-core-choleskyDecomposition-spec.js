import {choleskyDecomposition} from '../../src/plalib-core';

describe('choleskyDecomposition', function() {
  it('should be a function', function() {
    expect(choleskyDecomposition).toEqual(jasmine.any(Function));
  });
});
