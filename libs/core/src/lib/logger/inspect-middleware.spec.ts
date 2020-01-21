import * as util from 'util';

import * as inspectMiddleware from './inspect-middleware';

describe('Inspect middleware', () => {
  describe('inspectMsgs() function', () => {
    it('should call `inspect()` on msgs that are of type `object` and return', () => {
      const inspectMock = spyOn(util, 'inspect').and.returnValue(
        'mocked-inspect'
      );

      const msgs = [1, '2', [], {}, () => null];
      const options = {};

      const res = inspectMiddleware.inspectMsgs(options, msgs);

      expect(res).toEqual([
        msgs[0],
        msgs[1],
        'mocked-inspect',
        'mocked-inspect',
        msgs[4]
      ]);
      expect(inspectMock).toHaveBeenCalledWith(msgs[2], options);
      expect(inspectMock).toHaveBeenCalledWith(msgs[3], options);
    });
  });

  describe('inspectableLog() function', () => {
    it('should call `inspectMsgs()` with msgs and options and pass to log fn', () => {
      const inspectMock = spyOn(util, 'inspect').and.returnValue(
        'mocked-inspect'
      );

      const logFn = jest.fn();
      const msgs = [1, '2', {}] as const;
      const options = {};

      const res = inspectMiddleware.inspectableLog(logFn, options);
      res(...msgs);

      expect(inspectMock).toHaveBeenCalledWith(msgs[2], options);
      expect(logFn).toHaveBeenCalledWith(1, '2', 'mocked-inspect');
    });
  });
});
