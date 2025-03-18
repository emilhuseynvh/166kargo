import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { UserControlller } from "./user.controller";
import { UserService } from "./user.service";
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserControlller],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }