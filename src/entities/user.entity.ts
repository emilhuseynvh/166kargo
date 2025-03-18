import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    fin: string;

    @Column()
    seria: string;

    @Column()
    phone: string;

    @OneToOne(() => ProfileEntity, profile => profile.user, { cascade: true })
    profile: ProfileEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}