import { SetMetadata } from '@nestjs/common';
import { userPrivilege } from '../../users/schemas/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (privilege: userPrivilege) => SetMetadata(ROLES_KEY, privilege);

