import { SetMetadata } from '@nestjs/common';
import { USER_TYPE_ENUM } from 'src/common/dto/base.dto';
import { Constants } from '../constants';

export const RequirePermission = (requiredRole: USER_TYPE_ENUM) => SetMetadata(Constants.PERMISSION_METADATA_KEY, requiredRole);
