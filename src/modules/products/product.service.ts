import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { MoreThan, Not, Repository } from 'typeorm';

import { UpdateProductDto, CreateProductDto } from './product.dto';
import { PaginationDto } from '../../common/dto/base.dto';
import { Helper } from '../../common/helpful';

@Injectable()
export class ProductService {
	constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>) {}

	async duplicateCheck(productId: number, productTitle: string) {
		if (!productId && !productTitle) {
			return false;
		}

		const duplicateCheckQuery: any = {};
		if (productTitle) {
			duplicateCheckQuery['title'] = productTitle;
			if (productId) {
				duplicateCheckQuery['id'] = Not(productId);
			}
		}

		return await this.productRepository.findOne({ where: duplicateCheckQuery });
	}

	async updateProduct(updateProductId: number, updateProductDto: UpdateProductDto, requestUserId: number) {
		const existenceCheck = {
			id: updateProductId,
		};

		const prodExistCheck = await this.productRepository.findOne({ where: existenceCheck });
		if (!prodExistCheck) {
			throw new ForbiddenException('Product not found');
		}

		const duplicateCheckRes = await this.duplicateCheck(updateProductId, updateProductDto.title);
		if (duplicateCheckRes) {
			throw new ForbiddenException('Data is not unique');
		}

		await this.productRepository.update({ id: updateProductId }, { ...updateProductDto, updated_by: requestUserId });

		return {
			message: 'Product Updated Successfully',
		};
	}

	async addProduct(productCreateDto: CreateProductDto, userId: number) {
		const duplicateCheckRes = await this.duplicateCheck(null, productCreateDto.title);
		if (duplicateCheckRes) {
			throw new ForbiddenException('Data is not unique');
		}

		await this.productRepository.insert({ ...productCreateDto, created_by: userId });

		return {
			message: 'Product Added Successfully',
		};
	}

	async listProducts(paginationDto: PaginationDto, isAdmin: boolean) {
		const paginationArgs = Helper.validatePagination(paginationDto);

		let wherePart = {};
		if (!isAdmin) {
			wherePart = { is_active: true, quantity: MoreThan(0) };
		}
		const countResponse = await this.productRepository.count({ where: wherePart });
		const products = await this.productRepository.find({ where: wherePart, ...paginationArgs.queryPart });

		return {
			...Helper.blacklist(paginationArgs, ['queryPart']),
			totalCount: countResponse,
			pageData: products,
		};
	}
}
