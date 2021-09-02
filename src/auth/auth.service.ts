import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { CookieOptions, Response } from 'express';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { jwtDto } from './dto/jwt.dto';
import { jwtPayload } from './dto/JwtPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    loginname: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userService.findByLoginname(loginname);

    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateJwtUserExist(
    payload: jwtPayload,
  ): Promise<boolean | UserDocument> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      return false;
    }

    if (user.name !== payload.name) {
      return false;
    }

    if (user.privilege !== payload.privilege) {
      return false;
    }

    return user;
  }

  async valideUserCanModify(
    userid: string,
    createby: string,
  ): Promise<boolean> {
    const user = await this.userService.findOne(userid);

    if (user.privilege == userPrivilege.admin) {
      return true;
    }

    if (user._id.toHexString() === createby) {
      return true;
    }

    return false;
  }

  async verifyRefreshToken(refreshtoken: string): Promise<jwtDto> {
    if (refreshtoken === undefined) {
      throw new UnauthorizedException();
    }

    const receiveToken = await this.jwtService.verify(refreshtoken);
    if (!receiveToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(receiveToken.userid);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.createAccessToken(user);
  }

  async createAccessToken(user: UserDocument): Promise<jwtDto> {
    const payload = {
      name: user.name,
      sub: user.id,
      privilege: user.privilege,
    };

    return plainToClass(jwtDto, {
      access_token: this.jwtService.sign(payload),
      duration: this.configService.get<string>('JWT_TIME'),
    });
  }

  async login(user: UserDocument, response: Response): Promise<jwtDto> {
    const { envHttpOnly, envSecurity } = JSON.parse(
      this.configService.get<string>('COOKIE_SETTING'),
    );

    const _cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(this.configService.get<string>('COOKIE_TIME')) * 1000,
      ),
      httpOnly: envHttpOnly,
      secure: envSecurity,
    };

    response.cookie(
      'blogRefreshToken',
      this.jwtService.sign(
        { userid: user._id },
        { expiresIn: `${this.configService.get<string>('COOKIE_TIME')}s` },
      ),
      _cookieOptions,
    );

    return this.createAccessToken(user);
  }
}
