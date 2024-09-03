import { Expose } from "class-transformer";

export class UserDto {

    @Expose()
    email: string;

    //Don't want to return the password
}