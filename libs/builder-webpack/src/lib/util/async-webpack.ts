import * as webpack from 'webpack';

import { PromiseWithError } from './promise';

export function runCompiler(
  compiler: webpack.ICompiler
): PromiseWithError<webpack.Stats, Error> {
  return new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        rej(err);
      }

      res(stats);
    });
  });
}
