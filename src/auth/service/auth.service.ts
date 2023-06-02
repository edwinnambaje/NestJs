/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { user } from 'src/user/model/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateJWT(user: user): Observable<string> {
    return from<string>(this.jwtService.sign({ user }));
  }
  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }
  comparePassword(newPassword: string, passwortHash: string): Observable<any> {
    return from(bcrypt.compare(newPassword, passwortHash));
  }
}
