import { Body, Controller, Post, Put, Param, Req, Query, Get, Patch } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';
import { Request } from 'express';
import { Headers } from '../../common/decorators/header.decorator';
import { RequirePermission } from '../../common/decorators/permission.decorator';
import { PaginationDto, USER_TYPE_ENUM } from '../../common/dto/base.dto';

@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get('list')
	productLogin(@Query() paginationDto: PaginationDto, @Req() req: Request) {
		const { admin: isAdmin } = req.USER;
		return this.productService.listProducts(paginationDto, isAdmin);
	}

	@Post('add')
	@RequirePermission(USER_TYPE_ENUM.ADMIN)
	addProduct(@Body() addProductDto: CreateProductDto, @Req() req: Request) {
		const { id: userId } = req.USER;
		return this.productService.addProduct(addProductDto, userId);
	}

	@Patch(':productId')
	@RequirePermission(USER_TYPE_ENUM.ADMIN)
	updateProduct(@Body() updateProductDto: UpdateProductDto, @Param('productId') productId: number, @Req() req: Request) {
		const { id: userId } = req.USER;
		return this.productService.updateProduct(productId, updateProductDto, userId);
	}
}
