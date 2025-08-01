import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
    BadRequestException,
    UnauthorizedException,
    UploadedFile,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiQuery,
} from '@nestjs/swagger';
import { isValidUrl } from '../../utils/index';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { uploadConfig } from 'module/upload/utils/multer.config';
import { MulterS3File } from 'module/upload/utils/multe.s3.file';
import { CreatePostDto } from './create-post.dto';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
     constructor(private readonly postService: PostsService) { }

     @UseGuards(AuthGuard)
     @UseInterceptors(AnyFilesInterceptor(uploadConfig))
     @ApiBearerAuth()
     @ApiOperation({ summary: 'Create Post' })
     @ApiBody({
         schema: {
             type: 'object',
             properties: {
                 title: { type: 'string', example: 'Title Post' },
                 content: { type: 'string', example: 'Content Post' },
                 privacy: { type: 'string', example: 'public | friend | private' },
                 hashtags: {
                     type: 'array',
                     items: { type: 'string' },
                     example: ['nestjs', 'backend'],
                 },
                 images: {
                     type: 'array',
                     items: { type: 'string' },
                     example: ['https://example.com/image1.jpg'],
                 },
                 videos: {
                     type: 'array',
                     items: { type: 'string' },
                     example: ['https://example.com/video1.mp4'],
                 },
                 post_link_meta: {
                     type: 'object',
                     properties: {
                         post_link_url: { type: 'string', example: 'https://vnexpress.net/...' },
                         post_link_title: { type: 'string', example: 'Title link' },
                         post_link_description: { type: 'string', example: 'description link' },
                         post_link_content: { type: 'string', example: 'Content link' },
                         post_link_image: { type: 'string', example: 'https://...' },
                     }
                 }
             },
             required: ['title', 'content']
         }
     })
     @Post('create')
     async create(
         @UploadedFiles() files: Express.Multer.File[],
         @Body() body: CreatePostDto,
         @Req() req: AuthRequest
     ) {
         const userId = req.user?.userId 
         if (!userId) {
             throw new UnauthorizedException('User not found in request');
         }
         const images: MulterS3File[] = files.filter(file => file.fieldname === 'images');
         const videos: MulterS3File[] = files.filter(file => file.fieldname === 'videos');
         return this.postService.createPost(body, userId, images, videos);
     }

     @ApiOperation({ summary: 'Get posts by type friend ' })
     @ApiQuery({
          name: 'type',
          enum: ['friend', 'public', 'me'],
          required: true,
          description: 'Type of posts to retrieve',
     })
     @ApiQuery({
          name: 'page',
          required: false,
          type: Number,
          example: 1,
          description: 'Current page number (default = 1)',
     })
     @ApiQuery({
          name: 'limit',
          required: false,
          type: Number,
          example: 10,
          description: 'Number of posts per page (default = 10)',
     })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Get('')
     async getFriendPosts(
          @Req() req: AuthRequest,
          @Query('page') page = '1',
          @Query('limit') limit = '10',
     ) {
          const userId = req.user?.userId;
          if (!userId) {
               throw new UnauthorizedException('User not found in request');
          }
          const parsedPage = parseInt(page, 10);
          const parsedLimit = parseInt(limit, 10);

          return this.postService.getFeedPosts(userId, parsedPage, parsedLimit);
     }

     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Get(':id')
     async getPostsByType(
          @Req() req: AuthRequest,
          @Param('userId') id: string,
          @Query('page') page = '1',
          @Query('limit') limit = '10',
     ) {
          if (!id) {
               throw new UnauthorizedException('User not found in request');
          }
          const userId = req.user?.id
          const parsedPage = parseInt(page, 10);
          const parsedLimit = parseInt(limit, 10);

          return this.postService.getPostsByUser(id, userId, parsedPage, parsedLimit);
     }

     @ApiBearerAuth()
     @ApiBody({
          description: 'URL extract metadata',
          type: Object,
          examples: {
               example: {
                    summary: 'Example',
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
