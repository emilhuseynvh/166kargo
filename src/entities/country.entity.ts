import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RatesEntity } from "./rates.entity";
import { UploadEntity } from "./upload.entity";

@Entity('country')
export class CountryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    currency: string;

    @OneToMany(() => RatesEntity, rates => rates.country, { cascade: true })
    rates: RatesEntity[];

    @ManyToOne(() => UploadEntity, upload => upload.country)
    flag: UploadEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}