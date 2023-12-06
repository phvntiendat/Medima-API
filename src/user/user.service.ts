import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.model';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

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
}
