import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { Repository } from 'typeorm';
import { user } from '../model/user.interface';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}
  createUser(user: user): Observable<user> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;
        return from(this.userRepository.save(newUser)).pipe(
          map((user: user) => {
            const { password, ...result } = user;
            console.log(result, password);
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findOne(id: number): Observable<any> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: user) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }
  findAll(): Observable<user[]> {
    return from(this.userRepository.find()).pipe(
      map((users: user[]) => {
        users.forEach(function (user) {
          delete user.password;
        });
        return users;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
  updateOne(id: number, user: user): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }
  login(user: user): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: user) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Invalid credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<user> {
    return from(
      this.findByMail(email).pipe(
        switchMap((user: user) =>
          this.authService.comparePassword(password, user.password).pipe(
            map((match: boolean) => {
              if (match) {
                const { password, ...result } = user;
                return result;
              } else {
                throw Error;
              }
            }),
          ),
        ),
      ),
    );
  }

  findByMail(email: string): Observable<user> {
    return from(this.userRepository.findOne({ where: { email } }));
  }
}
