import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthClientMiddleware implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Autenticação de client inválida!');
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_CLIENT);
      request.client = decoded;

      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException(
        'Acesso negado. Token de cliente inválido ou expirado.',
      );
    }
  }
}
