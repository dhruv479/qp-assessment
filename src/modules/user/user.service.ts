import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Not, Repository } from 'typeorm';
import { TokenUtil } from '../../common/utils/token';

import { UpdateUserDto, UserLoginDto, UserSignupDto } from './user.dto';
import { PassUtils } from '../../common/utils/password';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

	async duplicateCheck(userId: number, employeeEmail: string, employeePhone: string) {
		if (!employeeEmail && !employeePhone) {
			return false;
		}

		const duplicateCheckQuery: any = {};
		if (userId) {
			duplicateCheckQuery['id'] = Not(userId);
		}
		if (employeeEmail) {
			duplicateCheckQuery['email'] = employeeEmail;
		}
		if (employeePhone) {
			duplicateCheckQuery['phone'] = employeePhone;
		}

		return await this.userRepository.findOne({ where: duplicateCheckQuery });
	}

	async updateUser(updateEmployeeId: number, UpdateUserDto: UpdateUserDto, requestUserId: number) {
		const existenceCheck = {
			id: updateEmployeeId,
		};

		const empExistCheck = await this.userRepository.findOne({ where: existenceCheck });
		if (!empExistCheck) {
			throw new ForbiddenException('User not found');
		}

		const duplicateCheckRes = await this.duplicateCheck(empExistCheck.id, UpdateUserDto.email, UpdateUserDto.phone);
		if (duplicateCheckRes) {
			throw new ForbiddenException('Data is not unique');
		}

		if (UpdateUserDto.is_admin === true || UpdateUserDto.is_admin === false) {
			const checkAdmin = await this.userRepository.findOne({ where: { id: requestUserId } });
			if (checkAdmin.is_admin !== true) {
				throw new ForbiddenException('Unauthorize action');
			}
		}

		if (UpdateUserDto.password) {
			UpdateUserDto.password = await new PassUtils().generateHash(UpdateUserDto.password);
		}

		await this.userRepository.update({ id: updateEmployeeId }, { ...UpdateUserDto, updated_by: requestUserId });

		return {
			message: 'User Updated Successfully',
		};
	}

	async signupUser(userSignupDto: UserSignupDto) {
		const duplicateCheckRes = await this.duplicateCheck(null, userSignupDto.email, userSignupDto.phone);
		if (duplicateCheckRes) {
			throw new ForbiddenException('Data is not unique');
		}

		if (userSignupDto.password) {
			userSignupDto.password = await new PassUtils().generateHash(userSignupDto.password);
		}

		await this.userRepository.insert(userSignupDto);

		return {
			message: 'User Added Successfully',
		};
	}

	async loginUser(loginDto: UserLoginDto) {
		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid username or password');
		}
		if (!user.is_active) {
			throw new ForbiddenException('Account Disabled');
		}

		user.id = Number(user.id);
		const passMatch = await new PassUtils().comparePassword(loginDto.password, user.password);

		if (!passMatch) {
			throw new UnauthorizedException('Invalid username or password');
		}

		await this.userRepository.update({ id: user.id }, { last_login_at: new Date(), updated_at: user.updated_at });

		const tokenPayload = {
			id: user.id,
			name: user.name,
			email: user.email,
			admin: user.is_admin,
		};

		const token = await new TokenUtil().generate(tokenPayload);

		return {
			token,
			details: {
				id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				admin: user.is_admin,
			},
		};
	}
}
