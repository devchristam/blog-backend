import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { userPrivilege } from '../users/schemas/user.schema';
import { Roles } from '../auth/decorator/roles.decorator';
import { User } from '../users/decorator/user.decorator';
import { jwtUser } from '../auth/dto/jwtUser.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.write)
  @Post()
  create(@User() user: jwtUser, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.write)
  @Patch(':id')
  update(@Param('id') id: string,@User() user: jwtUser, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, user, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
