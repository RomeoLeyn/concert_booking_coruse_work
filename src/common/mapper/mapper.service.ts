import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

@Injectable()
export class MapperService {
    toDto<T, V>(dtoClass: new () => T, entity: V, extra: Record<string, any> = {}): T {
        return plainToInstance(dtoClass, {
            ...entity,
            ...extra,
        }, {
            excludeExtraneousValues: true,
        });
    }

    toDtoArray<T, V>(dtoClass: new () => T, entities: V[], extraFn?: (entity) => any): T[] {
        return entities.map((entity) =>
            this.toDto(dtoClass, entity, extraFn ? extraFn(entity) : {})
        );
    }
}