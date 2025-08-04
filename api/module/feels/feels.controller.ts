import { Body, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { FeelService } from "./feels.service";
import { CreateFeelDto } from "./create-feel.dto";

@Controller('post-feels')
export class FeelController {
    constructor(
        private readonly feelService: FeelService
    ) { }

    @HttpCode(HttpStatus.CREATED)
    async createFeel(@Body() createFeelDto: CreateFeelDto) {
        const createdFeel = await this.feelService.createFeel(createFeelDto);
        return {
            message: 'Create',
            data: createdFeel,
            statusCode: HttpStatus.CREATED,
        };
    }
}



