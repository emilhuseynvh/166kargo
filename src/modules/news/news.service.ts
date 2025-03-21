import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/news.entity";
import { Repository } from "typeorm";
import { CreateNewsDto, CreateNewsTranslationsDto } from "./dto/create-news.dto";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shared/utils/translations.util";
import { UpdateNewsDto } from "./dto/update-news.dto";

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private newsRepo: Repository<NewsEntity>,
        private cls: ClsService,
        private i18n: I18nService<I18nTranslations>
    ) { }

    async list(page: number = 1, limit: number = 10) {
        let lang = this.cls.get<string>('lang');

        let skip = (page - 1) * limit;

        let [news, total] = await this.newsRepo.findAndCount({
            where: {
                translation: { lang }
            },
            select: {
                id: true,
                image: {
                    id: true,
                    path: true
                },
                translation: {
                    id: true,
                    field: true,
                    value: true,
                    lang: true
                }
            },
            skip,
            take: limit,
            relations: ['translation', 'image']
        });

        let args = this.i18n.t('arguments.news');
        if (!news.length) throw new NotFoundException(this.i18n.t('error.notFound', { args: { key: args } }));

        return {
            news: news.map(mapTranslation),
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        };

    }

    async create(params: CreateNewsDto) {
        let translation: any = [];

        for (let element of params.translations) {
            translation.push({
                field: 'title',
                value: element.title,
                lang: element.lang
            });

            translation.push({
                field: 'description',
                value: element.description,
                lang: element.lang
            });
        }

        let news = this.newsRepo.create({
            image: { id: params.image },
            translation
        });

        await news.save();

        return news;
    }

    async deleteNews(id: number) {
        let result = await this.newsRepo.delete(id);

        let args = this.i18n.t('arguments.news');
        if (!result.affected) throw new NotFoundException(this.i18n.t('error.notFound', { args: { key: args } }));

        return {
            message: this.i18n.t('success.deleted', { args: { key: args } })
        };
    }

    async update(id: number, params: UpdateNewsDto) {
        let news = await this.newsRepo.findOne({
            where: { id },
            relations: ['translation', 'image']
        });

        let args = this.i18n.t('arguments.news');
        if (!news) throw new NotFoundException(this.i18n.t('error.notFound', { args: { key: args } }));


        if (params.image) {
            news.image = { id: params.image } as any;
        }

        if (params.translations) {
            let updatedTranslations: any = [];

            for (let element of params.translations) {
                updatedTranslations.push({
                    field: 'title',
                    value: element.title,
                    lang: element.lang
                });

                updatedTranslations.push({
                    field: 'description',
                    value: element.description,
                    lang: element.lang
                });
            }

            news.translation = updatedTranslations as any;
        }

        await news.save();

        return {
            message: this.i18n.t('success.updated', { args: { key: args } }),
            news
        };
    }
}