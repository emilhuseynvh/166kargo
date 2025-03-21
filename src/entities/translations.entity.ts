import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NewsEntity } from "./news.entity";
import { Lang } from "src/shared/enums/lang.enum";

@Entity('translations')
export class TranslationsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: string;

    @Column()
    value: string;

    @Column({ type: 'enum', enum: Lang })
    lang: string;

    @ManyToOne(() => NewsEntity, news => news.translation, { onDelete: 'CASCADE' })
    news: NewsEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}