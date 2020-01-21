import { Stats } from 'webpack';

export class SuccessfulWebpackCompilation
  implements WebpackCompilerResolutionStrategy {
  constructor(private stats?: Stats) {}

  run(cb: WebpackCompilerRunHandler) {
    cb(undefined, this.stats);
  }
}

export class FailedWebpackCompilation
  implements WebpackCompilerResolutionStrategy {
  constructor(private error: Error = new Error('Compilation failed mock')) {}

  run(cb: WebpackCompilerRunHandler) {
    cb(this.error);
  }
}

export type WebpackCompilerRunHandler = (e?: Error, stats?: Stats) => void;

export interface WebpackCompilerResolutionStrategy {
  run(cb: WebpackCompilerRunHandler): void;
}

export class WebpackCompilerMock {
  constructor(private resolutionStrategy: WebpackCompilerResolutionStrategy) {}

  run = jest
    .fn()
    .mockImplementation((cb: WebpackCompilerRunHandler) =>
      this.resolutionStrategy.run(cb)
    );
}

export function createWebpackMock(
  resolutionStrategy: WebpackCompilerResolutionStrategy = new SuccessfulWebpackCompilation()
) {
  const webpackCompilerMock = new WebpackCompilerMock(resolutionStrategy);
  const webpackMock = jest.fn().mockReturnValue(webpackCompilerMock);

  return { webpackMock, webpackCompilerMock };
}
