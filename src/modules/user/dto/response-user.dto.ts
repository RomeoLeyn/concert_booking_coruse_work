import { Expose } from "class-transformer";
import { UserRole } from "src/common/enums/user-role.enum";

export class ResponseUserDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    role: UserRole;
}