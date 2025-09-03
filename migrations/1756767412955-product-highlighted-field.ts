import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductHighlightedField1756767412955 implements MigrationInterface {
    name = 'ProductHighlightedField1756767412955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "highlighted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "highlighted"`);
    }

}
