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
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,

        private jwt: JwtService,
        private cls: ClsService,

        private i18n: I18nService<I18nTranslations>
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

        if (!user) throw new NotFoundException(this.i18n.t('error.emailOrPasswordWrong'));

        let checkPassword = await bcrypt.compare(params.password, user.password);
        if (!checkPassword) throw new NotFoundException(this.i18n.t('error.emailOrPasswordWrong'));

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

        let args = this.i18n.t('arguments.user');
        if (checkUser) throw new ConflictException(this.i18n.t('error.conflict', { args: { key: args } }));

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

        let args = this.i18n.t('arguments.password');

        if (params.newPassword !== params.comfirmPassword) {
            throw new BadRequestException(this.i18n.t('error.passwordsNotMatch'));
        }

        let checkPassword = await bcrypt.compare(params.currentPassword, user.password);

        if (!checkPassword) throw new BadRequestException(this.i18n.t('error.wrongPassword'));

        let hashPassword = await bcrypt.hash(params.newPassword, 10);

        user.password = hashPassword;

        await user.save();

        return {
            message: this.i18n.t('success.updated', { args: { key: args } })
        };
    }
}