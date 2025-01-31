import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    { message: "Password should contain at least one uppercase letter, one lowercase letter, symbol such and a digit"})
    password: string;
}