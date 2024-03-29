import {MigrationInterface, QueryRunner} from "typeorm";

export class timestampsToTimestamptz1609160993414 implements MigrationInterface {
    name = 'timestampsToTimestamptz1609160993414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_group" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill_group" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_group" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill_group" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_subject" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill_subject" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_subject" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill_subject" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "cv" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "cv" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "cv" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cv" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "cv" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_subject" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill_subject" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_subject" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill_subject" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_group" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill_group" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill_group" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "skill_group" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
