import { Body, Controller, Post, Put, Param, Req } from '@nestjs/common';
import { UserLoginDto, UpdateUserDto, UpdatePasswordDto, UserSignupDto } from './user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { Headers } from '../../common/decorators/header.decorator';
import { RequirePermission } from '../../common/decorators/permission.decorator';
import { USER_TYPE_ENUM } from '../../common/dto/base.dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('login')
	userLogin(@Body() loginDto: UserLoginDto, @Req() req: Request) {
		return this.userService.loginUser(loginDto);
	}

	@Post('signup')
	userSignup(@Body() signupDto: UserSignupDto, @Req() req: Request) {
		return this.userService.signupUser(signupDto);
	}

	@Put('password')
	@Headers()
	updateProfilePassword(@Req() req: Request, @Body() updatepasswordDto: UpdatePasswordDto) {
		const { id: userId } = req.USER;
		return this.userService.updateUser(userId, updatepasswordDto, userId);
	}

	@Put(':userId')
	@Headers()
	@RequirePermission(USER_TYPE_ENUM.ADMIN)
	updateOneUser(@Req() req: Request, @Body() UpdateUserDto: UpdateUserDto, @Param('userId') updateUserId: number) {
		const { id: userId } = req.USER;
		return this.userService.updateUser(updateUserId, UpdateUserDto, userId);
	}
}
