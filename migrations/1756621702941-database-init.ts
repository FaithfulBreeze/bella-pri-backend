import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseInit1756621702941 implements MigrationInterface {
    name = 'DatabaseInit1756621702941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "src" character varying NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, "link" character varying, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset_products_product" ("assetId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_4db64ec6cc6834400a1b34fdf19" PRIMARY KEY ("assetId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d6b703941f961da534077c21c" ON "asset_products_product" ("assetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4454955b97e83178ba0db9b639" ON "asset_products_product" ("productId") `);
        await queryRunner.query(`CREATE TABLE "product_assets_asset" ("productId" integer NOT NULL, "assetId" integer NOT NULL, CONSTRAINT "PK_077661efe1b1a6f59f1fdf7bc91" PRIMARY KEY ("productId", "assetId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_707ffffe04cc66370872dac93a" ON "product_assets_asset" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d757f9dc829534dfa13c9a85f6" ON "product_assets_asset" ("assetId") `);
        await queryRunner.query(`ALTER TABLE "asset_products_product" ADD CONSTRAINT "FK_1d6b703941f961da534077c21cc" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "asset_products_product" ADD CONSTRAINT "FK_4454955b97e83178ba0db9b6397" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_assets_asset" ADD CONSTRAINT "FK_707ffffe04cc66370872dac93a9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_assets_asset" ADD CONSTRAINT "FK_d757f9dc829534dfa13c9a85f65" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_assets_asset" DROP CONSTRAINT "FK_d757f9dc829534dfa13c9a85f65"`);
        await queryRunner.query(`ALTER TABLE "product_assets_asset" DROP CONSTRAINT "FK_707ffffe04cc66370872dac93a9"`);
        await queryRunner.query(`ALTER TABLE "asset_products_product" DROP CONSTRAINT "FK_4454955b97e83178ba0db9b6397"`);
        await queryRunner.query(`ALTER TABLE "asset_products_product" DROP CONSTRAINT "FK_1d6b703941f961da534077c21cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d757f9dc829534dfa13c9a85f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_707ffffe04cc66370872dac93a"`);
        await queryRunner.query(`DROP TABLE "product_assets_asset"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4454955b97e83178ba0db9b639"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d6b703941f961da534077c21c"`);
        await queryRunner.query(`DROP TABLE "asset_products_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "asset"`);
    }

}
