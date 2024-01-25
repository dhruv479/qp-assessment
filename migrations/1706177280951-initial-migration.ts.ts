import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration implements MigrationInterface {
    name = 'InitialMigration'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "extra_details" jsonb, "name" character varying NOT NULL, "password" character varying(200) NOT NULL, "email" character varying NOT NULL, "phone" character varying, "is_active" boolean NOT NULL DEFAULT true, "is_admin" boolean NOT NULL DEFAULT false, "last_login_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "extra_details" jsonb, "title" character varying NOT NULL, "description" character varying, "price" integer NOT NULL, "mrp" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderitem" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "extra_details" jsonb, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "order_id" integer NOT NULL, CONSTRAINT "REL_a8760940688db18d75450bbadf" UNIQUE ("product_id"), CONSTRAINT "PK_b7f87d0e20dee3122eb2810d7ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "extra_details" jsonb, "price" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orderitem" ADD CONSTRAINT "FK_a8760940688db18d75450bbadf8" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderitem" DROP CONSTRAINT "FK_a8760940688db18d75450bbadf8"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "orderitem"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
