import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { user } from '../model/user.interface';
import { Observable, catchError, map, of } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: user): Observable<user | any> {
    return this.userService.createUser(user).pipe(
      map((user: user) => user),
      catchError((err) => of({ error: err.message })),
    );
  }
  @Post()
  login(@Body() user: user): Observable<object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { accessToken: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<user> {
    return this.userService.findOne(params.id);
  }

  @Get()
  findAll(): Observable<user[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param() id: number): Observable<user> {
    return this.userService.deleteOne(id);
  }

  @Put(':id')
  updateOne(@Param() id: number, @Body() user: user): Observable<user> {
    return this.userService.updateOne(id, user);
  }
}
