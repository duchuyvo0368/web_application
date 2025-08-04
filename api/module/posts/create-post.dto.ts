import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PostLinkMetaDto {
    @IsOptional()
    @IsString()
    post_link_url?: string;

    @IsOptional()
    @IsString()
    post_link_title?: string;

    @IsOptional()
    @IsString()
    post_link_description?: string;

    @IsOptional()
    @IsString()
    post_link_content?: string;

    @IsOptional()
    @IsString()
    post_link_image?: string;
}

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    privacy?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    friends_tagged?: string[];


    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    videos?: string[];
    @IsOptional()
    @ValidateNested()
    @Type(() => PostLinkMetaDto)
    post_link_meta?: PostLinkMetaDto;
}
