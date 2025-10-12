import { MigrationInterface, QueryRunner } from "typeorm";

export class TiktokVideosTable1759980263347 implements MigrationInterface {
    name = 'TiktokVideosTable1759980263347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tiktok_video" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "videoId" character varying NOT NULL, "order" integer NOT NULL, "highlighted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fbf95aa466ef34caea48a5c8f08" UNIQUE ("videoId"), CONSTRAINT "UQ_fcdc7a874c87e4accedb9bfd682" UNIQUE ("order"), CONSTRAINT "PK_089017a5ddbc558ae3a70dfd960" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tiktok_video"`);
    }

}
