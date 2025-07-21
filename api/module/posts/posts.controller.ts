import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post()
    async create(@Body() body: any,@Req() req: Request,) {
        return this.postService.createPost(body);
    }

//   @Get()
//   findAll() {
//     return this.postsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.postsService.findOne(+id);
//   }

// //   @Patch(':id')
// //   update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
// //     //return this.postsService.update(+id, updatePostDto);
// //   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.postsService.remove(+id);
//   }
}
