import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { User } from '../users/decorator/user.decorator';
import { jwtDto } from './dto/jwt.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserDocument): jwtDto {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  showUser(@User() user: UserDocument): UserDocument {
    return user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.admin)
  @Get('role')
  showPrivilege(@User() user: UserDocument): userPrivilege {
    return user.privilege;
  }
}
