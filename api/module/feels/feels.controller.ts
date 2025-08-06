import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { FeelService } from "./feels.service";
import { CreateFeelAdminDto, CreateFeelDto } from "./create-feel.dto";
import { AuthGuard } from "module/auth/guards/access-token.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AuthRequest } from "module/auth/interfaces/auth-request.interface";

@Controller('/')
export class FeelController {
    constructor(
        private readonly feelService: FeelService
    ) { }

    // @HttpCode(HttpStatus.CREATED)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    // @Post('/create-feel')
    // async createFeel(@Body() createFeelDto: CreateFeelDto) {
    //     const createdFeel = await this.feelService.createFeel(createFeelDto);
    //     return {
    //         message: 'Create',
    //         data: createdFeel,
    //         statusCode: HttpStatus.CREATED,
    //     };
    // }
    

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create-feel-admin')
    async createFeelAdmin(@Body() createFeelAdminDto: CreateFeelAdminDto) {
        const createdFeelAdmin = await this.feelService.createFeelAdmin(createFeelAdminDto);
        return {
            message: 'Create',
            data: createdFeelAdmin,
            statusCode: HttpStatus.CREATED,
        };
    }

    @UseGuards(AuthGuard)
    @Post('post-feels')
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                feel: { type: 'string', enum: ['like', 'love', 'haha'], nullable: true },
                postId: { type: 'string' },
            },
            required: ['postId'],
        },
    })
    async handleFeel(
        @Body() body: { feel_name?: 'like' | 'love' | 'haha'; postId: string },
        @Req() req: AuthRequest,
    ) {
        const userId = req.user?.userId;

        if (!userId) {
            throw new BadRequestException('User ID is missing from request');
        }

        if (!body.postId) {
            throw new BadRequestException('Post ID is required');
        }

        return await this.feelService.handleFeel(body.postId, userId, body.feel_name);
    }

}



