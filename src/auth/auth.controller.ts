import {
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { User } from '../users/decorator/user.decorator';
import { Response } from 'express';
import { Cookies } from './decorator/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response).catch(() => {
      throw new NotAcceptableException();
    });
  }

  @Post('accesstoken')
  async accessToken(@Cookies('blogRefreshToken') refreshtoken: string) {
    return this.authService.verifyRefreshToken(refreshtoken).catch(() => {
      throw new NotAcceptableException();
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  showUser(@User() user: UserDocument): UserDocument {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.admin)
  @Get('role')
  showPrivilege(@User() user: UserDocument): userPrivilege {
    return user.privilege;
  }
}
