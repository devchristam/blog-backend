import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(loginname: string, password: string): Promise<any> {
    const user = await this.userService.findByLoginname(loginname)

    if(user && user.password === password){
      const { password, loginname, ...rest} = user
      return user
    }

    return null
  }

  async login(user: any){
    const payload = {
      name: user.name,
      sub: user.id
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
