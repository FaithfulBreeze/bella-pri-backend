import { MigrationInterface, QueryRunner } from "typeorm";

export class PurchasePayerPhoneAreaCode1762313269462 implements MigrationInterface {
    name = 'PurchasePayerPhoneAreaCode1762313269462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhone"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhoneNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhoneAreaCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhone"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhoneAreaCode"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhone" character varying NOT NULL`);
    }

}
