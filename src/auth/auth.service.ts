import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { CookieOptions, Response } from 'express';
import { Model } from 'mongoose';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { jwtDto } from './dto/jwt.dto';
import { jwtPayload } from './dto/JwtPayload.dto';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refreshtoken.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private refreshtokenModel: Model<RefreshTokenDocument>,
  ) {}

  async validateUser(
    loginname: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userService.findByLoginname(loginname);

    if (!user) {
      throw new UnauthorizedException();
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
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

    const dbFindToken = await this.refreshtokenModel
      .find({
        rtoken: refreshtoken,
      })
      .exec();

    if (dbFindToken.length !== 1) {
      throw new UnauthorizedException();
    }

    if (dbFindToken[0].endAt.getTime() < Date.now()) {
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
    const { envHttpOnly, envSecurity, envDomain, envSameSite } = JSON.parse(
      this.configService.get<string>('COOKIE_SETTING'),
    );

    const _cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(this.configService.get<string>('COOKIE_TIME')) * 1000,
      ),
      httpOnly: envHttpOnly,
      secure: envSecurity,
      domain: envDomain,
      sameSite: envSameSite,
    };

    const createRefreshToken = this.jwtService.sign(
      { userid: user._id },
      { expiresIn: `${this.configService.get<string>('COOKIE_TIME')}s` },
    );

    const extraTime =
      parseInt(this.configService.get<string>('COOKIE_TIME')) * 1000;

    const storeRefreshToken = new this.refreshtokenModel({
      rtoken: createRefreshToken,
      endAt: new Date(Date.now() + extraTime),
    });

    await storeRefreshToken.save();

    response.cookie('blogRefreshToken', createRefreshToken, _cookieOptions);

    return this.createAccessToken(user);
  }

  async removeRefreshToken(refreshtoken: string): Promise<boolean> {
    if (refreshtoken === undefined) {
      throw new UnauthorizedException();
    }

    const receiveToken = await this.jwtService.verify(refreshtoken);
    if (!receiveToken) {
      throw new UnauthorizedException();
    }

    const dbFindToken = await this.refreshtokenModel
      .find({
        rtoken: refreshtoken,
      })
      .exec();

    if (dbFindToken.length !== 1) {
      throw new UnauthorizedException();
    }

    const dbRemoveToken = await this.refreshtokenModel
      .findOneAndDelete({
        rtoken: refreshtoken,
      })
      .exec();

    if (!dbRemoveToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
