import { Body, Controller, Post, Put, Param, Req, Query, Get, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { Headers } from '../../common/decorators/header.decorator';
import { RequirePermission } from '../../common/decorators/permission.decorator';
import { PaginationDto, USER_TYPE_ENUM } from '../../common/dto/base.dto';

@Controller('order')
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Get('list')
	orderLogin(@Query() paginationDto: PaginationDto, @Req() req: Request) {
		const { admin: isAdmin, id: userId } = req.USER;
		return this.orderService.listOrders(paginationDto, userId, isAdmin);
	}

	@Post('add')
	addOrder(@Body() addOrderDto: any, @Req() req: Request) {
		const { id: userId } = req.USER;
		return this.orderService.addOrder(addOrderDto, userId);
	}
}
