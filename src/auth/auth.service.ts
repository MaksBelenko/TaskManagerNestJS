import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AdvancedConsoleLogger } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SignInDto> {
        const username = await this.userRepository.validateUserPassword(
            authCredentialsDto,
        );
        // console.log(username);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);

        const signinDto = new SignInDto();
        signinDto.accessToken = accessToken;
        this.logger.debug(
            `Generated JWT Token with payload ${JSON.stringify(payload)}`,
        );

        return signinDto;
    }
}
