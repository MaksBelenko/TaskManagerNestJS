import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(password, salt);
        // console.log(hashedPassword);

        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = hashedPassword;

        try {
            await user.save();
        } catch (error) {
            console.log(error.code);
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string>  {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        
        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    private async generateSalt(): Promise<string> {
        return await bcrypt.genSalt();
    }
}
