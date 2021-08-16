import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userPrivilege } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Body() user: LoginDto): any {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @Get('role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.admin)
  getHello2(@Request() req): string {
    return 'foobar';
  }
}
