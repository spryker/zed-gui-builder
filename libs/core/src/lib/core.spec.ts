/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoopLogger } from '../../testing';
import { expectRejected } from '../../testing/promise';

import { Builder, provideBuilder, resetBuilder } from './builder';
import { ConfigValidator, InvalidConfigError } from './config';
import { execBuild } from './core';
import { Locator, provideLocator, resetLocator } from './locator';
import { provideLogger } from './logger';

describe('Core', () => {
  const noopLogger = new NoopLogger();

  beforeAll(() => provideLogger(noopLogger));

  afterEach(() => {
    resetLocator();
    resetBuilder();
  });

  describe('execBuild() function', () => {
    it('should reject when no locator was provided', () => {
      provideBuilder('builder' as any);

      expectRejected(execBuild({} as any), expect.any(String));
    });

    it('should reject when no builder was provided', () => {
      provideLocator('builder' as any);

      expectRejected(execBuild({} as any), expect.any(String));
    });

    it('should call `Locator.findEntries()` and `Builder.buildWithEntries()`', async () => {
      const mockLocator: Locator = {
        findEntries: jest.fn().mockReturnValue(Promise.resolve('mock-entries'))
      };
      const mockBuilder: Builder = {
        buildWithEntries: jest.fn().mockReturnValue(Promise.resolve())
      };

      const project = {
        rootPath: 'root',
        outputPath: 'out',
        name: 'name'
      };

      provideLocator(mockLocator);
      provideBuilder(mockBuilder);

      await execBuild({
        project,
        locator: 'locator-config',
        builder: 'builder-config'
      });

      expect(mockLocator.findEntries).toHaveBeenCalledWith('root', {
        config: 'locator-config',
        project,
        logger: noopLogger
      });

      expect(mockBuilder.buildWithEntries).toHaveBeenCalledWith(
        'mock-entries',
        'out',
        {
          config: 'builder-config',
          project,
          logger: noopLogger
        }
      );
    });

    describe('when `Locator` implements `ConfigValidator`', () => {
      it('should call `Locator.validateConfig()` with locator and project config', async () => {
        const mockLocator: Locator & ConfigValidator = {
          validateConfig: jest.fn(),
          findEntries: jest.fn()
        };
        const mockBuilder: Builder = {
          buildWithEntries: jest.fn()
        };

        const project = {
          rootPath: 'root',
          outputPath: 'out',
          name: 'name'
        };

        provideLocator(mockLocator);
        provideBuilder(mockBuilder);

        await execBuild({
          project,
          locator: 'locator-config'
        });

        expect(mockLocator.validateConfig).toHaveBeenCalledWith(
          'locator-config',
          project
        );
      });

      it('should reject when validation throws `InvalidConfigError`', async () => {
        const mockLocator: Locator & ConfigValidator = {
          validateConfig: jest.fn().mockImplementation(() => {
            throw new InvalidConfigError('validation failed');
          }),
          findEntries: jest.fn()
        };
        const mockBuilder: Builder = {
          buildWithEntries: jest.fn()
        };

        const project = {
          rootPath: 'root',
          outputPath: 'out',
          name: 'name'
        };

        provideLocator(mockLocator);
        provideBuilder(mockBuilder);

        const res = execBuild({
          project,
          locator: 'locator-config'
        });

        expectRejected(
          res,
          'Configuration is not valid: Error: validation failed'
        );
      });
    });

    describe('when `Builder` implements `ConfigValidator`', () => {
      it('should call `Builder.validateConfig()` with builder and project config', async () => {
        const mockLocator: Locator = {
          findEntries: jest.fn()
        };
        const mockBuilder: Builder & ConfigValidator = {
          validateConfig: jest.fn(),
          buildWithEntries: jest.fn()
        };

        const project = {
          rootPath: 'root',
          outputPath: 'out',
          name: 'name'
        };

        provideLocator(mockLocator);
        provideBuilder(mockBuilder);

        await execBuild({
          project,
          builder: 'builder-config'
        });

        expect(mockBuilder.validateConfig).toHaveBeenCalledWith(
          'builder-config',
          project
        );
      });

      it('should reject when validation throws `InvalidConfigError`', async () => {
        const mockLocator: Locator = {
          findEntries: jest.fn()
        };
        const mockBuilder: Builder & ConfigValidator = {
          validateConfig: jest.fn().mockImplementation(() => {
            throw new InvalidConfigError('validation failed');
          }),
          buildWithEntries: jest.fn()
        };

        const project = {
          rootPath: 'root',
          outputPath: 'out',
          name: 'name'
        };

        provideLocator(mockLocator);
        provideBuilder(mockBuilder);

        const res = execBuild({
          project,
          builder: 'builder-config'
        });

        expectRejected(
          res,
          'Configuration is not valid: Error: validation failed'
        );
      });
    });
  });
});
