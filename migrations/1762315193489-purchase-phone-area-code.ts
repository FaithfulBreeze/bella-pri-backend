import { MigrationInterface, QueryRunner } from "typeorm";

export class PurchasePhoneAreaCode1762315193489 implements MigrationInterface {
    name = 'PurchasePhoneAreaCode1762315193489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhone" character varying NOT NULL`);
    }

}
