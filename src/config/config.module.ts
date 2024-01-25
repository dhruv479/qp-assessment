import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';

@Global()
@Module({
	providers: [ConfigService],
})
export class ConfigModule {}
