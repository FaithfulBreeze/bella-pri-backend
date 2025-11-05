import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPurchaseStatusEnum1762315699607 implements MigrationInterface {
  name = 'FixPurchaseStatusEnum1762315699607'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Rename the old column temporarily
    await queryRunner.query(`ALTER TABLE "purchase" RENAME COLUMN "status" TO "status_old"`);

    // 2. Add the new column as varchar
    await queryRunner.query(`ALTER TABLE "purchase" ADD "status" character varying`);

    // 3. Migrate data from old column to new column
    // Assuming old values were integers or strings like old enum indexes
    // You can adjust mapping logic if you know the previous enum values
    await queryRunner.query(`
      UPDATE "purchase"
      SET "status" = 
        CASE "status_old"
          WHEN 0 THEN 'PENDING_PAYMENT'
          WHEN 1 THEN 'PURCHASED'
          WHEN 2 THEN 'SHIPPED'
          WHEN 3 THEN 'DELIVERED'
          ELSE 'PENDING_PAYMENT'
        END
    `);

    // 4. Set new column as NOT NULL
    await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" SET NOT NULL`);

    // 5. Drop the old column
    await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "status_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse steps
    await queryRunner.query(`ALTER TABLE "purchase" ADD "status_old" integer`);
    await queryRunner.query(`
      UPDATE "purchase"
      SET "status_old" =
        CASE "status"
          WHEN 'PENDING_PAYMENT' THEN 0
          WHEN 'PURCHASED' THEN 1
          WHEN 'SHIPPED' THEN 2
          WHEN 'DELIVERED' THEN 3
          ELSE 0
        END
    `);
    await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "purchase" RENAME COLUMN "status_old" TO "status"`);
  }
}
