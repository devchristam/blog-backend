import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { Roles } from '../auth/decorator/roles.decorator';
import { User } from '../users/decorator/user.decorator';
import { findAllQueryDto } from './dto/find-all.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.write)
  @Post()
  create(@User() user: UserDocument, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get()
  findAll(@Query() {skip, limit}: findAllQueryDto) {
    return this.postsService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.modify)
  @Patch(':id')
  update(@Param('id') id: string,@User() user: UserDocument, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, user, updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userPrivilege.modify)
  @Delete(':id')
  remove(@User() user, @Query('hard') hard: string, @Param('id') id: string) {
    if(hard === "true"){
      return this.postsService.hardRemove(user, id);
    }
    return this.postsService.softRemove(user, id);
  }
}
