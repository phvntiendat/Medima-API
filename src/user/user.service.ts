import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.model';
import { UpdatePasswordDto } from './dto/password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private mailerService: MailerService
    ) { }

    async createUser(userDto: CreateUserDto) {

        // check if user already existed
        const userInDb = await this.userRepository.findByCondition({
            email: userDto.email
        })

        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        if (!userDto.avatar) userDto.avatar = "" // leaving avatar as blank string
        userDto.role = 'user'
        userDto.password = await bcrypt.hash(userDto.password, 10); // hasing password

        return await this.userRepository.create(userDto)
    }

    async login({ email, password }: LoginUserDto) {
        const user = await this.userRepository.findByCondition({
            email: email,
        })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async updateUserRefreshToken(filter, update) {
        if (update.refreshToken) {
            update.refreshToken = await bcrypt.hash(
                this.reverse(update.refreshToken),
                10,
            );
        }
        return await this.userRepository.findByConditionAndUpdate(filter, update);
    }

    private reverse(s) {
        return s.split('').reverse().join('');
    }

    async findByEmail(email) {
        return await this.userRepository.findByCondition({
            email: email,
        });
    }

    async getUserByRefresh(refresh_token, email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const is_equal = await bcrypt.compare(
            this.reverse(refresh_token),
            user.refreshToken,
        );

        if (!is_equal) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async searchUser(keyword: string, page: number, limit: number = 10) {
        let query = {
            $or: [
                { first_name: { $regex: keyword, $options: 'i' } }, 
                { last_name: { $regex: keyword, $options: 'i' } }, 
                { email: { $regex: keyword, $options: 'i' } },    
            ],
        }
        if(!keyword) query = null
        const count = await this.userRepository.countDocuments(query)
        const countPage = Math.ceil(count / limit)
        const users = await this.userRepository.getByCondition(
            query,
            ['first_name', 'last_name', 'email', 'avatar'],
            {
                sort: {
                    _id: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
        )
        return { count, countPage, users }
    }

    async updateUser(user: User, userDto: UpdateUserDto) {
        return await this.userRepository.findByIdAndUpdate(user.id, userDto);
    }

    async changePassword(user: User, passwordDto: UpdatePasswordDto) {
        if (!bcrypt.compareSync(passwordDto.old_password, user.password)) {
            throw new HttpException('Wrong old password', HttpStatus.BAD_REQUEST);
        }

        if (passwordDto.old_password === passwordDto.new_password) {
            throw new HttpException('New password cant be the same as old password', HttpStatus.BAD_REQUEST);
        }
        const newPassword = await bcrypt.hash(passwordDto.new_password, 10);

        return await this.userRepository.findByIdAndUpdate(user.id, {
            password: newPassword
        })
    }

    async forgotPassword(email: string) {
        const userCheck = await this.userRepository.findByCondition({ email: email })
        if (!userCheck) throw new HttpException('No such email exists', HttpStatus.BAD_REQUEST);

        const newPassword = this.generateRandomPassword(10);
        const newPasswordHashed = await bcrypt.hash(newPassword, 10);
        await this.userRepository.findByIdAndUpdate(userCheck.id, { password: newPasswordHashed })

        await this.mailerService.sendMail({
            to: email,
            subject: 'Your new password',
            template: `./forgotpassword`,
            context: {
                password: newPassword
            }
        })

        return "check your email for new password"

    }

    generateRandomPassword(length: number): string {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const specialCharacters = "!@#$%^&*()_-+=<>?/[]{}|";
        // Ensure at least one special character
        const randomSpecialChar = specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
        // Ensure at least one capital letter
        const randomCapitalLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
        // Generate the remaining part of the password
        const remainingLength = length - 2; // 1 for special char, 1 for capital letter
        let password = "";
        for (let i = 0; i < remainingLength; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset.charAt(randomIndex);
        }
        // Insert the special character and capital letter at random positions
        const randomPosition1 = Math.floor(Math.random() * (length - 1)); // position for special char
        const randomPosition2 = Math.floor(Math.random() * length); // position for capital letter
      
        password =
          password.slice(0, randomPosition1) +
          randomSpecialChar +
          password.slice(randomPosition1, randomPosition2) +
          randomCapitalLetter +
          password.slice(randomPosition2);
      
        return password;
      }
      
}
