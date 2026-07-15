import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
