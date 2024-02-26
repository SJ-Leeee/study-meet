import { IsEnum } from 'class-validator';
import { UserRole } from 'src/entities/Users';

export class EditRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
