import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { Repository } from 'typeorm';
import { user } from '../model/user.interface';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  createUser(user: user): Observable<user> {
    return from(this.userRepository.save(user));
  }
  findOne(id: number): Observable<any> {
    return from(this.userRepository.findOneBy({ id }));
  }
  findAll(): Observable<user[]> {
    return from(this.userRepository.find());
  }
  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
  updateOne(id: number, user: user): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
