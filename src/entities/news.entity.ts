import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";

@Entity('news')
export class NewsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => UploadEntity, upload => upload.news)
    image: UploadEntity;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TranslationsEntity, translations => translations.news, { cascade: true })
    translation: TranslationsEntity[];
}