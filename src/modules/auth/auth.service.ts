import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { PrecinctEntity } from "src/entities/precinct.entity";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ClsService } from "nestjs-cls";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,

        @InjectRepository(PrecinctEntity)
        private precinctRepo: Repository<PrecinctEntity>,

        private jwt: JwtService,
        private cls: ClsService
    ) { }
    async login(params: LoginAuthDto) {
        let user = await this.userRepo.findOne({
            where: { email: params.email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                surname: true,
                fin: true,
                seria: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
                profile: {
                    id: true,
                    birth: true,
                    adress: true,
                    nationality: true,
                    gender: true,
                    precinct: {
                        id: true,
                        name: true
                    }
                }
            },
            relations: ['profile', 'profile.precinct']
        });

        if (!user) throw new NotFoundException('Email or password is wrong');

        let checkPassword = await bcrypt.compare(params.password, user.password);
        if (!checkPassword) throw new NotFoundException('Email or password is wrong');

        let token = this.jwt.sign({ userId: user.id });

        return {
            token,
            user
        };
    }

    async register(params: RegisterAuthDto) {
        let where: FindOptionsWhere<UserEntity>[] = [
            {
                email: params.email
            },
            {
                fin: params.fin
            },
            {
                seria: params.seria
            },
            {
                phone: params.phone
            }
        ];

        let checkUser = await this.userRepo.findOne({ where });

        if (checkUser) throw new ConflictException('User is already exists');

        // let precinct = await this.precinctRepo.findOne({
        //     where: { profile: { id: params.precinct } }
        // });

        // if (!precinct) throw new NotFoundException('Precinct is not found');

        let hashPassword = await bcrypt.hash(params.password, 10);

        const userData: DeepPartial<UserEntity> = {
            email: params.email,
            phone: params.phone,
            fin: params.fin,
            seria: params.seria,
            name: params.name,
            surname: params.surname,
            password: hashPassword,
            profile: {
                birth: params.birth,
                adress: params.address,
                nationality: params.nationality,
                gender: params.gender,
                precinct: {
                    profile: {
                        id: params.precinct
                    }
                }
            }
        };

        let user = this.userRepo.create(userData);

        await user.save();

        return {
            ...user,
            password: undefined
        };

    }

    async resetPassword(params: ResetPasswordDto) {
        let user = this.cls.get<UserEntity>('user');

        if (params.newPassword !== params.comfirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        let checkPassword = await bcrypt.compare(params.currentPassword, user.password);

        if (!checkPassword) throw new BadRequestException('Password is wrong');

        let hashPassword = await bcrypt.hash(params.newPassword, 10);

        user.password = hashPassword;

        await user.save();

        return {
            message: "Password is updated succesfully"
        };
    }
}