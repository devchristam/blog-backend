import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../../../secret/constants";
import { AuthService } from "../auth.service";
import { jwtPayload } from "../dto/JwtPayload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: jwtPayload) {
    const userExist = await this.authService.validateJwtUserExist(payload)

    if(!userExist){
      return false
    }

    return {
      id: payload.sub,
      name: payload.name,
      privilege: payload.privilege
    }
  }
}