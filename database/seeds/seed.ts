import * as bcrypt from 'bcrypt';
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { SkillSubject } from "../../src/skill_subjects/skill-subject.entity";
import { User } from "../../src/users/user.entity";
import { CV } from "../../src/cv/cv.entity";
import { Skill } from "../../src/skills/skill.entity";

const SKILLS = [
  'Go',
  'React',
  'Angular 2',
  'Angular 1',
  'Java',
  'Ansible',
  'Docker',
  'Agile',
  'TDD',
  'Jenkins',
  'AWS',
];

export default class Seed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.synchronize(true);

    const admin = await factory(User)().make({ firstName: 'John', lastName: 'Doe', username: 'admin' });
    admin.password = await bcrypt.hash('Admin123', admin.salt);
    await admin.save();
    await factory(CV)().create({ userId: admin.id })

    const skillSubjects: SkillSubject[] = [];
    for (const name of SKILLS) {
      const skillSubject: SkillSubject = await factory(SkillSubject)().create({ name });
      skillSubjects.push(skillSubject);
    };

    const cvs: CV[] = await factory(CV)()
      .map(async (cv: CV) => {
        const user: User = await factory(User)().create();
        cv.user = user;

        return cv;
      })
      .createMany(10);


    for (const cv of cvs) {
      const randomSkills: SkillSubject[] = skillSubjects.sort(() => 0.5 - Math.random()).slice(0, 6);

      for (const skillSubject of randomSkills) {
        await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });
      };
    };
  }
}
