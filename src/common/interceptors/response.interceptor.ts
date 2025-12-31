import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map((data) => {
                if (data?.status && data?.code) return data;
                return {
                    status: 'success',
                    code: 200,
                    data,
                };
            })
        )
    }
}