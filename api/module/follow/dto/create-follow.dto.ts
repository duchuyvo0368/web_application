import { IsNotEmpty } from "class-validator";

export class CreateFollowDto {
    @IsNotEmpty()
    followerId: string;
    createdAt?: Date; // Optional, will default to current date if not provided
    updatedAt?: Date; // Optional, will default to current date if not provided
}
