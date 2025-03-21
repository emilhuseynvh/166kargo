import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CountryEntity } from "./country.entity";
import { NewsEntity } from "./news.entity";

@Entity('upload')
export class UploadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column()
    mimetype: string;

    @OneToMany(() => CountryEntity, country => country.flag)
    country: CountryEntity;

    @OneToMany(() => NewsEntity, news => news.image)
    news: NewsEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}