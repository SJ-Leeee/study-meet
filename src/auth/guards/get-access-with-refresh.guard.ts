import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GetAccessWithRefreshGuard extends AuthGuard(
  'jwt-refresh-strategy',
) {}
