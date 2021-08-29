import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserDocument } from "../../users/schemas/user.schema";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username:string, passport: string): Promise<UserDocument> {
    const user = await this.authService.validateUser(username, passport)

    if(!user){
      throw new UnauthorizedException()
    }

    return user
  }
}