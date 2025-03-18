import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PrecinctEntity } from "./precinct.entity";
import { UserEntity } from "./user.entity";
import { Gender } from "src/shared/enums/gender.enum";

@Entity('profile')
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    birth: string;

    @Column()
    adress: string;

    @Column()
    nationality: string;

    @Column({ type: 'enum', enum: Gender, default: Gender.MEN })
    gender: string;

    @OneToOne(() => PrecinctEntity, precinct => precinct.profile, { nullable: true })
    precinct: PrecinctEntity;

    @OneToOne(() => UserEntity, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}