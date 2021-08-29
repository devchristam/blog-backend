import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { jwtDto } from './dto/jwt.dto';
import { jwtPayload } from './dto/JwtPayload.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(loginname: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findByLoginname(loginname)

    if(!user || user.password !== password){
      throw new UnauthorizedException()
    }

    return user
  }

  async validateJwtUserExist(payload: jwtPayload): Promise<boolean | UserDocument> {
    const user = await this.userService.findOne(payload.sub)

    if(!user){
      return false
    }

    if(user.name !== payload.name){
      return false
    }

    if(user.privilege !== payload.privilege){
      return false
    }

    return user
  }

  async valideUserCanModify(userid: string, createby: string): Promise<boolean>{
    const user = await this.userService.findOne(userid)

    if(user.privilege == userPrivilege.admin){
      return true
    }

    if(user._id.toHexString() === createby){
      return true
    }

    return false
  }

  login(user: UserDocument): jwtDto{
    const payload = {
      name: user.name,
      sub: user.id,
      privilege: user.privilege
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
