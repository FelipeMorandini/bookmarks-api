import {Body, Controller, Post, Req} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import {SignUpDto} from "./dto/signup.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return await this.authService.signup(dto);
    }

    @Post('signin')
    async signin(@Body() dto: AuthDto) {
        return await this.authService.login(dto)
    }
}