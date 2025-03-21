import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/news.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([NewsEntity, UploadEntity])],
    controllers: [NewsController],
    providers: [NewsService]
})
export class NewsModule { }