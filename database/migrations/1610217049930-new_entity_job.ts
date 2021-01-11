import {MigrationInterface, QueryRunner} from "typeorm";

export class newEntityJob1610217049930 implements MigrationInterface {
    name = 'newEntityJob1610217049930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "job_state_enum" AS ENUM('pending', 'rejected', 'cancelled', 'approved', 'running', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "runner" character varying NOT NULL, "data" json NOT NULL, "skipApproval" boolean NOT NULL DEFAULT false, "description" character varying NOT NULL, "state" "job_state_enum" NOT NULL DEFAULT 'pending', "log" character varying NOT NULL DEFAULT '', "userId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_308fb0752c2ea332cb79f52ceaa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_308fb0752c2ea332cb79f52ceaa"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TYPE "job_state_enum"`);
    }

}
