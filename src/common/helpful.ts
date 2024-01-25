import { Constants } from './constants';
import { BadRequestException } from '@nestjs/common';

export class Helper {
	static parseBoolean = function (input) {
		switch (String(input).toLowerCase()) {
			case 'true':
			case 'yes':
			case 'y':
			case '1':
				return true;
			case 'false':
			case 'no':
			case '0':
			case 'n':
				return false;
			default:
				return undefined;
		}
	};

	static whitelist = function (params, keyList) {
		if (!(keyList instanceof Array && keyList.length > 0)) return {};
		var output = {};
		keyList.forEach(function (key) {
			if (params[key]) output[key] = params[key];
		});
		return output;
	};

	static blacklist = function (params, keyList) {
		if (!(keyList instanceof Array && keyList.length > 0)) return params;
		keyList.forEach(function (key) {
			if (params[key]) delete params[key];
		});
		return params;
	};

	static validatePagination = function (
		params,
		{ sortItems = Constants.VALID_SORT_KEYS, maxSize = Constants.DEFAULT_PAGESIZE, skipPagesizeCheck = false } = {},
	) {
		if (!params.pageSize) {
			params.pageSize = maxSize;
		} else {
			params.pageSize = Number(params.pageSize);
		}

		if (!params.pageNumber) {
			params.pageNumber = Constants.DEFAULT_PAGENUM;
		} else {
			params.pageNumber = Number(params.pageNumber);
			if (!skipPagesizeCheck && params.pageNumber > Constants.MAXIMUM_PAGESIZE) {
				throw new BadRequestException(`Maximum ${Constants.MAXIMUM_PAGESIZE} items allowed`);
			}
		}

		if (!params.sortBy || !sortItems.includes(params.sortBy)) {
			params.sortBy = sortItems[0];
		}

		if (!params.ascending || (params.ascending != 'true' && params.ascending != 'false')) {
			params.ascending = Constants.DEFAULT_ORDER;
		} else {
			if (params.ascending == 'true') {
				params.ascending = 'ASC';
			} else {
				params.ascending = 'DESC';
			}
		}

		return {
			queryPart: {
				skip: (params.pageNumber - 1) * params.pageSize,
				take: params.pageSize,
				order: {
					[params.sortBy]: params.ascending,
				},
			},
			...params,
		};
	};

	static getQueryInString = function (length, startingPos = 1) {
		if (!startingPos) startingPos = 1;
		var inStrArr = [];
		for (var i = 0; i < length; i++) {
			inStrArr.push('$' + (i + startingPos).toString());
		}
		var inString = '(' + inStrArr.join(',') + ')';
		return inString;
	};
}
