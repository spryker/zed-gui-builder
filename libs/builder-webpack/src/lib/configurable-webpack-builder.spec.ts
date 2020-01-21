import { Configuration } from 'webpack';

import { NoopLogger } from '@zed-builder/core/testing';

import { WebpackBuilderOptions } from './builder';
import { ConfigurableWebpackBuilder } from './configurable-webpack-builder';

class WebpackCompilerMock {
  run = jest.fn().mockReturnValue(Promise.resolve('compiled'));
}

function createWebpackMock() {
  const webpackCompilerMock = new WebpackCompilerMock();
  const webpackMock = jest.fn().mockReturnValue(webpackCompilerMock);

  return { webpackMock, webpackCompilerMock };
}

describe('ConfigurableWebpackBuilder', () => {
  describe('buildWithEntries() method', () => {
    it('should run webpack compiler with computed configuration', async () => {
      const entries = ['entry1', 'entry2'];
      const outputPath = 'out-path';
      const extraEntries = ['extra-entry1', 'extra-entry2'];
      const options: WebpackBuilderOptions = {
        logger: new NoopLogger(),
        config: { entry: extraEntries },
        project: { name: 'name', outputPath, rootPath: 'root-path' }
      };

      const expectedWebpackConfig: Configuration = {
        entry: [...entries, ...extraEntries],
        output: { path: outputPath }
      };

      const { webpackMock, webpackCompilerMock } = createWebpackMock();

      const builder = new ConfigurableWebpackBuilder();

      builder.provideWebpack(() => webpackMock as any);

      await builder.buildWithEntries(entries, outputPath, options);

      expect(webpackMock).toHaveBeenCalledWith(expectedWebpackConfig);
      expect(webpackCompilerMock.run).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });
});
