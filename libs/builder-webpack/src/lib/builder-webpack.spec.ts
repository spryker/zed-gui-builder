import { builderWebpack } from './builder-webpack';

describe('builderWebpack', () => {
  it('should work', () => {
    expect(builderWebpack()).toEqual('builder-webpack');
  });
});
