import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CountryEntity } from "./country.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}