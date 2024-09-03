import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: ClassConstructor) { }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> { // the colon in this case tells typescript what type we are returning
        //Run something before a request is handled by the request handler here

        return handler.handle().pipe(
            map((data: any) => {
                //Run something before the data is sent out
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true, //remove properties not marked with "Expose" in UserDto
                });
            })
        )
    }
}