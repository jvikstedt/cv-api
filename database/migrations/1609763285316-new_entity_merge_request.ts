import {MigrationInterface, QueryRunner} from "typeorm";

export class newEntityMergeRequest1609763285316 implements MigrationInterface {
    name = 'newEntityMergeRequest1609763285316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "merge_request_state_enum" AS ENUM('pending', 'rejected', 'cancelled', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "merge_request" ("id" SERIAL NOT NULL, "sourceId" integer NOT NULL, "targetId" integer NOT NULL, "sourceName" character varying NOT NULL, "targetName" character varying NOT NULL, "entity" character varying NOT NULL, "msg" character varying NOT NULL DEFAULT '', "state" "merge_request_state_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dac26612dc914df81d07cc7cecf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD CONSTRAINT "FK_2e36761f4a423dec5387025ba29" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merge_request" DROP CONSTRAINT "FK_2e36761f4a423dec5387025ba29"`);
        await queryRunner.query(`DROP TABLE "merge_request"`);
        await queryRunner.query(`DROP TYPE "merge_request_state_enum"`);
    }

}
