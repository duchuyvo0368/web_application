import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { isValidUrl } from '../../utils/index'
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('create')
    async create(@Body() body: any, @Req() req: Request,) {
        return this.postService.createPost(body);
    }


    @UseGuards(AuthGuard) 
    @Get('all')
    async getAllPublicPosts(
        @Req() req: AuthRequest,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        const userId = req.user!!.userId;
        const result = await this.postService.getNewsFeedPosts(userId, Number(page), Number(limit));
        return result;
    }


    @ApiBearerAuth()
    @ApiBody({
    description: 'URL cần trích xuất metadata',
    type: Object,
    examples: {
      example: {
        summary: 'Ví dụ',
        value: {
          url: 'https://vnexpress.net/lo-hong-tu-vu-lat-tau-vinh-xanh-4917031.html',
        },
      },
    },
  })
    @UseGuards(AuthGuard) 
    @Post('extract-link-metadata')
    async extractLinkMetadata(@Body('url') url: string) {
        if (!isValidUrl(url)) {
            throw new BadRequestException('URL không hợp lệ');
        }      
        const metadata = await this.postService.extractLinkMetadata(url);
        return { metadata };
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
