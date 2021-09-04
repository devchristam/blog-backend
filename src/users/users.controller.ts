import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { userPrivilege } from './schemas/user.schema';
import { Roles } from '../auth/decorator/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './decorator/user.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.write)
  @Get(':id')
  findOne(@User() user, @Param('id') id: string) {
    return this.usersService.findOneRoute(user, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.modify)
  @Patch(':id')
  update(
    @User() user,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
