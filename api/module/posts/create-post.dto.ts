import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// dto/post-link-meta.dto.ts
export class PostLinkMetaDto {
    post_link_url: string; // bắt buộc
    post_link_title?: string;
    post_link_description?: string;
    post_link_content?: string;
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
export class EditPostDto {
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

