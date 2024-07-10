import * as morgan from 'morgan';
import { Injectable, NestMiddleware } from '@nestjs/common';

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    morgan(morganFormat, { stream: res.writableEnd })(req, res, next);
  }
}