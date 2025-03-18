import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CountryEntity } from "./country.entity";

@Entity('rates')
export class RatesEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    minWeight: number;

    @Column()
    maxWeight: number;

    @Column()
    price: number;

    @ManyToOne(() => CountryEntity, country => country.rates)
    country: CountryEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}