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
import { Observable } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: user): Observable<user> {
    return this.userService.createUser(user);
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
