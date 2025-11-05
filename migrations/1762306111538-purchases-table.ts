import { MigrationInterface, QueryRunner } from "typeorm";

export class PurchasesTable1762306111538 implements MigrationInterface {
    name = 'PurchasesTable1762306111538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "paymentId" character varying NOT NULL, "status" integer NOT NULL, "totalCost" integer NOT NULL, "zipCode" character varying NOT NULL, "streetName" character varying NOT NULL, "streetNumber" character varying NOT NULL, "neighborhood" character varying NOT NULL, "city" character varying NOT NULL, "federalUnit" character varying NOT NULL, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_purchases_purchase" ("productId" integer NOT NULL, "purchaseId" integer NOT NULL, CONSTRAINT "PK_c333a8802a9efbf1c36a6c9cd3e" PRIMARY KEY ("productId", "purchaseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ebbe6525d01b8fee445cf8172a" ON "product_purchases_purchase" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1cb0bd592eb7698e5b8bdc5696" ON "product_purchases_purchase" ("purchaseId") `);
        await queryRunner.query(`CREATE TABLE "purchase_products_product" ("purchaseId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_6dda49c7a99eadd7549d7a71db9" PRIMARY KEY ("purchaseId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_60f37c2b142964ed7e6c38c32c" ON "purchase_products_product" ("purchaseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6cdd70374e621d22a3f466eb7a" ON "purchase_products_product" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_purchases_purchase" ADD CONSTRAINT "FK_ebbe6525d01b8fee445cf8172a4" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_purchases_purchase" ADD CONSTRAINT "FK_1cb0bd592eb7698e5b8bdc5696c" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_products_product" ADD CONSTRAINT "FK_60f37c2b142964ed7e6c38c32cf" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "purchase_products_product" ADD CONSTRAINT "FK_6cdd70374e621d22a3f466eb7ae" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_products_product" DROP CONSTRAINT "FK_6cdd70374e621d22a3f466eb7ae"`);
        await queryRunner.query(`ALTER TABLE "purchase_products_product" DROP CONSTRAINT "FK_60f37c2b142964ed7e6c38c32cf"`);
        await queryRunner.query(`ALTER TABLE "product_purchases_purchase" DROP CONSTRAINT "FK_1cb0bd592eb7698e5b8bdc5696c"`);
        await queryRunner.query(`ALTER TABLE "product_purchases_purchase" DROP CONSTRAINT "FK_ebbe6525d01b8fee445cf8172a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6cdd70374e621d22a3f466eb7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60f37c2b142964ed7e6c38c32c"`);
        await queryRunner.query(`DROP TABLE "purchase_products_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cb0bd592eb7698e5b8bdc5696"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ebbe6525d01b8fee445cf8172a"`);
        await queryRunner.query(`DROP TABLE "product_purchases_purchase"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
    }

}
