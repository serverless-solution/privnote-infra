import { Request, Response, NextFunction } from 'express';

/**
 * Fixes issue where `req.body` is a Buffer (not parsed) due to serverless-http + API Gateway.
 * Ensures JSON body is parsed manually if express.json() doesn't handle it.
 * https://github.com/dougmoscrop/serverless-http/issues/305
 */
export function v5JsonBodyParserFix(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  if (req.is('application/json') && Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString('utf8'));
    } catch (e) {
      console.error('Failed to parse body:', e);
    }
  }
  next();
}
