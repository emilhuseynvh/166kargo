import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { NewsService } from "./news.service";
import { Auth } from "src/shared/decorators/auth.decorator";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService
    ) { }

    @Get()
    async list() {
        return await this.newsService.list();
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateNewsDto) {
        return await this.newsService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateNewsDto) {
        return await this.newsService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteNews(@Param('id') id: number) {
        return await this.newsService.deleteNews(id);
    }
}