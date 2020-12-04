import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1607088109206 implements MigrationInterface {
    name = 'initial1607088109206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "exporter" character varying NOT NULL, "userId" integer NOT NULL, "global" boolean NOT NULL DEFAULT false, "data" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a62147c0d6b868e797061e142a1" UNIQUE ("name"), CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" character varying NOT NULL, "originalname" character varying NOT NULL, "encoding" character varying NOT NULL, "mimetype" character varying NOT NULL, "destination" character varying NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "size" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "jobTitle" character varying NOT NULL, "phone" character varying NOT NULL, "location" character varying NOT NULL, "workExperienceInYears" integer NOT NULL, "email" character varying NOT NULL, "password" character varying, "salt" character varying, "avatarId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_3e1f52ec904aed992472f2be14" UNIQUE ("avatarId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_89f70a2af311e91555c758b893f" UNIQUE ("name"), CONSTRAINT "PK_7aba2020a477493c6620acebb30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_subject" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "skillGroupId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51e948c6581abb27815da8e026b" UNIQUE ("name", "skillGroupId"), CONSTRAINT "PK_f3df1537e58410d1b5dbadf2a8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "companyId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8f2a2525ac32368a14a2cb11d66" UNIQUE ("name", "companyId"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_membership" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "role" character varying NOT NULL, "startYear" smallint NOT NULL, "startMonth" smallint NOT NULL, "endYear" smallint, "endMonth" smallint, "highlight" boolean NOT NULL DEFAULT false, "cvId" integer NOT NULL, "projectId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_014d8d8717bd042113ffac67159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "membership_skill" ("id" SERIAL NOT NULL, "experienceInYears" real NOT NULL DEFAULT 0, "automaticCalculation" boolean NOT NULL DEFAULT true, "projectMembershipId" integer NOT NULL, "skillId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1397764baa63a06d9690e6034c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" SERIAL NOT NULL, "experienceInYears" real NOT NULL DEFAULT 0, "interestLevel" integer NOT NULL, "highlight" boolean NOT NULL DEFAULT false, "cvId" integer NOT NULL, "skillSubjectId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "SKILL_UQ_RELATION" UNIQUE ("skillSubjectId", "cvId"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "school" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_73c2a2b94ffa6b0fabf50b64743" UNIQUE ("name"), CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education" ("id" SERIAL NOT NULL, "degree" character varying NOT NULL, "fieldOfStudy" character varying NOT NULL, "description" character varying NOT NULL, "startYear" smallint NOT NULL, "endYear" smallint, "highlight" boolean NOT NULL DEFAULT false, "cvId" integer NOT NULL, "schoolId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cv" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_e4b7330e64fd0ecce86720e62f" UNIQUE ("userId"), CONSTRAINT "PK_4ddf7891daf83c3506efa503bb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_experience" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "jobTitle" character varying NOT NULL, "startYear" smallint NOT NULL, "startMonth" smallint NOT NULL, "endYear" smallint, "endMonth" smallint, "highlight" boolean NOT NULL DEFAULT false, "cvId" integer NOT NULL, "companyId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bef63ad6da7ec327515c121bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_roles_role" ("usersId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_3fb5295f0482f3c5090b41a5427" PRIMARY KEY ("usersId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ea8bcae76ff0b74bcc1340af8" ON "users_roles_role" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03c652226fd376f26b31503d40" ON "users_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_subject" ADD CONSTRAINT "FK_949ca92610d88a3550fe5f55c62" FOREIGN KEY ("skillGroupId") REFERENCES "skill_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_17c18aa92afa5fa328e9e181fe8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_133279c4e427846ec701ea67cd7" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_64f251ee61ba7531396f34ba8af" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD CONSTRAINT "FK_e42b2ed52f62455a8d03cda7213" FOREIGN KEY ("projectMembershipId") REFERENCES "project_membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_skill" ADD CONSTRAINT "FK_a38980a4f7ff431c6058d3fca8f" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_762b79bed6fe5c8ff134b72e796" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_f3d934ef720252b9fca4170c853" FOREIGN KEY ("skillSubjectId") REFERENCES "skill_subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_5f14cc76c59d7a30e5b8b1ce3d8" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_055d55437d4995b575d0f080525" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cv" ADD CONSTRAINT "FK_e4b7330e64fd0ecce86720e62f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD CONSTRAINT "FK_d4e46d49ecc77dae08b75a60afd" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD CONSTRAINT "FK_0075bebb83b48038731a357a4ef" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_03c652226fd376f26b31503d40c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_03c652226fd376f26b31503d40c"`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86"`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP CONSTRAINT "FK_0075bebb83b48038731a357a4ef"`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP CONSTRAINT "FK_d4e46d49ecc77dae08b75a60afd"`);
        await queryRunner.query(`ALTER TABLE "cv" DROP CONSTRAINT "FK_e4b7330e64fd0ecce86720e62f9"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_055d55437d4995b575d0f080525"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_5f14cc76c59d7a30e5b8b1ce3d8"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_f3d934ef720252b9fca4170c853"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_762b79bed6fe5c8ff134b72e796"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP CONSTRAINT "FK_a38980a4f7ff431c6058d3fca8f"`);
        await queryRunner.query(`ALTER TABLE "membership_skill" DROP CONSTRAINT "FK_e42b2ed52f62455a8d03cda7213"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_64f251ee61ba7531396f34ba8af"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_133279c4e427846ec701ea67cd7"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_17c18aa92afa5fa328e9e181fe8"`);
        await queryRunner.query(`ALTER TABLE "skill_subject" DROP CONSTRAINT "FK_949ca92610d88a3550fe5f55c62"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56"`);
        await queryRunner.query(`DROP INDEX "IDX_03c652226fd376f26b31503d40"`);
        await queryRunner.query(`DROP INDEX "IDX_3ea8bcae76ff0b74bcc1340af8"`);
        await queryRunner.query(`DROP TABLE "users_roles_role"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "work_experience"`);
        await queryRunner.query(`DROP TABLE "cv"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`DROP TABLE "school"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "membership_skill"`);
        await queryRunner.query(`DROP TABLE "project_membership"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "skill_subject"`);
        await queryRunner.query(`DROP TABLE "skill_group"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "template"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
