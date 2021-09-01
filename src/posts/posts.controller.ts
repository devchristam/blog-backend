import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { Roles } from '../auth/decorator/roles.decorator';
import { User } from '../users/decorator/user.decorator';
import { findAllPagingDto } from './dto/find-all-paging.dto';
import { findAllPostDto } from './dto/find-all-posts.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.write)
  @Put()
  create(@User() user: UserDocument, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Post()
  findAll(
    @Query() { skip, limit }: findAllPagingDto,
    @Body() browseQuery: findAllPostDto,
  ) {
    return this.postsService.findAll(skip, limit, browseQuery);
  }

  @Get('/tags')
  findAllTags() {
    return this.postsService.findAllTags();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.modify)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserDocument,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user, updatePostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userPrivilege.modify)
  @Delete(':id')
  remove(@User() user, @Query('hard') hard: string, @Param('id') id: string) {
    if (hard === 'true') {
      return this.postsService.hardRemove(user, id);
    }
    return this.postsService.softRemove(user, id);
  }
}
