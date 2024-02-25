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

      if (!accessToken || !refreshToken) {
        throw new BusinessException(
          'token',
          'token is no111t exist',
          'token is111 not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      req['accessToken'] = accessToken;
      req['refreshToken'] = refreshToken;

      next();
    } catch (error) {
      throw new BusinessException(
        'token',
        'token is not exist',
        'token is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
