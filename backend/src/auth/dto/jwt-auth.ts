import { Role } from '../../generated/prisma/enums.js';

export type JwtAuth = {
  userId: number;
  role: Role;
};
