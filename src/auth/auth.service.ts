import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { SignUpDto } from "./dto/signup.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {
    }
    async signup(dto: SignUpDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            })

            delete user.password;

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exists')
                }
            }
            throw error;
        }
    }

    async login(dto: AuthDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            })

            if (!user) {
                throw new ForbiddenException('Email or password is incorrect');
            }

            const pwMatches = argon.verify(
                user.password,
                dto.password
            );

            if (!pwMatches) {
                throw new ForbiddenException('Email or password is incorrect');
            }

            delete user.password;

            return user;
        } catch (error) {
            throw error;
        }

        return {msg: 'I have logged in'}
    }

}