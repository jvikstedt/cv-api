import * as bcrypt from 'bcrypt';
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { SkillSubject } from "../../src/skill_subjects/skill-subject.entity";
import { User } from "../../src/users/user.entity";
import { CV } from "../../src/cv/cv.entity";
import { Skill } from "../../src/skills/skill.entity";
import { SkillGroup } from '../../src/skill_groups/skill-group.entity';

const SKILLS = {
  ['Programming languages']: [
    'Go',
    'Java',
    'Typescript',
    'Javascript',
    'Ruby',
    'C++',
  ],
  ['Frameworks']: [
    'Ruby on Rails',
    'Vue.js',
    'React.js',
    'Angular 2',
    'Angular 1',
  ],
  ['Other']: [
    'ElasticSearch',
    'Linux',
    'Vim',
    'Apache Kafka',
    'Robot Framework',
    'Microservices',
    'MySQL',
    'PostgreSQL',
    'Git',
    'Kubernetes',
    'GCP',
    'Ansible',
    'Docker',
    'Agile',
    'TDD',
    'Jenkins',
    'AWS',
  ],
};

export default class Seed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.synchronize(true);

    const skillGroups: SkillGroup[] = [];
    const skillSubjects: SkillSubject[] = [];

    for (const skillGroupName of Object.keys(SKILLS)) {
      const skillGroup: SkillGroup = await factory(SkillGroup)().create({ name: skillGroupName });
      skillGroups.push(skillGroup);

      for (const name of SKILLS[skillGroupName]) {
        const skillSubject: SkillSubject = await factory(SkillSubject)().create({ name, skillGroupId: skillGroup.id });
        skillSubjects.push(skillSubject);
      }
    };

    // Create admin user
    const admin = await factory(User)().make({ firstName: 'John', lastName: 'Doe', username: 'admin' });
    admin.password = await bcrypt.hash('Admin123', admin.salt);
    await admin.save();
    const adminCV = await factory(CV)().create({ userId: admin.id, description: '' })
    let randomSkills: SkillSubject[] = skillSubjects.sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const skillSubject of randomSkills) {
      await factory(Skill)().create({ cvId: adminCV.id, skillSubjectId: skillSubject.id });
    };

    // Create test automation user
    const testAutomationUser = await factory(User)().make({ firstName: 'Bob', lastName: 'Test', username: 'bobtest' });
    testAutomationUser.password = await bcrypt.hash('BobTest123', testAutomationUser.salt);
    await testAutomationUser.save();
    await factory(CV)().create({ userId: testAutomationUser.id })

    const cvs: CV[] = await factory(CV)()
      .map(async (cv: CV) => {
        const user: User = await factory(User)().create();
        cv.user = user;

        return cv;
      })
      .createMany(10);


    for (const cv of cvs) {
      randomSkills = skillSubjects.sort(() => 0.5 - Math.random()).slice(0, 6);

      for (const skillSubject of randomSkills) {
        await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });
      };
    };
  }
}
