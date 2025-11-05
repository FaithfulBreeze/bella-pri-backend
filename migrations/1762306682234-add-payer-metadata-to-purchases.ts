import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayerMetadataToPurchases1762306682234 implements MigrationInterface {
    name = 'AddPayerMetadataToPurchases1762306682234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerPhone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payerName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerName"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerEmail"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payerPhone"`);
    }

}
