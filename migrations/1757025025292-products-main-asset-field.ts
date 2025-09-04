import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsMainAssetField1757025025292 implements MigrationInterface {
    name = 'ProductsMainAssetField1757025025292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "mainAssetId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_92f14880ad49380df1336a9468a" FOREIGN KEY ("mainAssetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_92f14880ad49380df1336a9468a"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "mainAssetId"`);
    }

}
