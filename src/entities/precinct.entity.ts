import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";

@Entity('precinct')
export class PrecinctEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => ProfileEntity, profile => profile.precinct, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'profileId',
        referencedColumnName: 'id'
    })
    profile: ProfileEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}