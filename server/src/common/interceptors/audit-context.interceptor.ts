import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../../modules/auth/decorators/current-user.decorator';
import { auditContextStorage } from '../audit-context.storage';

@Injectable()
export class AuditContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      ip?: string;
      method?: string;
      url?: string;
      user?: AuthenticatedUser;
      headers: Record<string, string | string[] | undefined>;
    }>();

    const userAgent = request.headers['user-agent'];
    const auditContext = {
      ip: request.ip,
      userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
      requestId: randomUUID(),
      method: request.method,
      path: request.url,
      userId: request.user?.id,
    };

    return new Observable((subscriber) => {
      auditContextStorage.run(auditContext, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}