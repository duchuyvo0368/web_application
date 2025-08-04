import { Injectable } from "@nestjs/common";
import { Feel, FeelRelation } from "./feels.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFeelDto } from "./create-feel.dto";


@Injectable()
export class FeelService {
    constructor(
        @InjectModel(Feel.name, 'MONGODB_CONNECTION')
        private feelModel: Model<FeelRelation>
    ) { }
    

    async createFeel(createFeelDto: CreateFeelDto) {
        return await this.feelModel.create({
            ...createFeelDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async updateFeel() {
    }
    async getFeel() {
        const feel = await this.feelModel.find()
        return feel
    }

    
}


