import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty({ message: '昵称不能为空' })
  readonly nickname: string;
  @IsNotEmpty({ message: '重复密码不能为空' })
  @ApiProperty()
  readonly email: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty()
  readonly password: string;
  @IsNotEmpty({ message: '重复密码不能为空' })
  @ApiProperty()
  readonly passwordRepeat: string;
}
