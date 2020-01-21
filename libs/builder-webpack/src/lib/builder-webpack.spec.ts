import { createWebpackBuilder } from './builder-webpack';
import { ConfigurableWebpackBuilder } from './configurable-webpack-builder';

describe('Builder: Webpack', () => {
  describe('createWebpackBuilder() function', () => {
    it('should return `builder` object of type `ConfigurableWebpackBuilder`', () => {
      expect(createWebpackBuilder().builder).toEqual(
        expect.any(ConfigurableWebpackBuilder)
      );
    });

    it('should return `configurator` object of type `ConfigurableWebpackBuilder`', () => {
      expect(createWebpackBuilder().configurator).toEqual(
        expect.any(ConfigurableWebpackBuilder)
      );
    });
  });
});
