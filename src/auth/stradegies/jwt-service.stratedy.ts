// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtServiceStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-strategy',
// ) {
//   constructor() {
//     super({
//       secretOrKey: process.env.JWT_SECRET_KEY,
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false, // 2
//     });
//   }

//   async validate(payload: any) {
//     console.log(payload);
//     return payload;
//   }
// }
