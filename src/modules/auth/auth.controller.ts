import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { Auth } from "src/shared/decorators/auth.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('login')
    async login(@Body() body: LoginAuthDto) {
        return await this.authService.login(body);
    }

    @Post('register')
    async register(@Body() body: RegisterAuthDto) {
        return await this.authService.register(body);
    }

    @Post('reset-password')
    @Auth()
    async resetPassword(@Body() body: ResetPasswordDto) {
        return await this.authService.resetPassword(body);
    }
}
