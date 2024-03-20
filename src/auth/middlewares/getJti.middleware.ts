import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { access } from 'fs';
import { BusinessException } from 'src/exception/businessException';

@Injectable()
export class GetJtiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const refreshToken = req.cookies['refreshToken'];

      req['accessToken'] = accessToken;
      req['refreshToken'] = refreshToken;

      next();
    } catch (error) {
      throw new BusinessException(
        'token',
        'token does not exist',
        'token does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
