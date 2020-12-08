import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { SkillSubject } from '../../src/skill_subjects/skill-subject.entity';
import { User } from '../../src/users/user.entity';
import { CV } from '../../src/cv/cv.entity';
import { Skill } from '../../src/skills/skill.entity';
import { SkillGroup } from '../../src/skill_groups/skill-group.entity';
import { School } from '../../src/schools/school.entity';
import { Education } from '../../src/educations/education.entity';
import { Company } from '../../src/company/company.entity';
import { WorkExperience } from '../../src/work_experience/work-experience.entity';
import { Project } from '../../src/project/project.entity';
import { ProjectMembership } from '../../src/project_membership/project-membership.entity';
import { MembershipSkill } from '../../src/membership_skill/membership-skill.entity';
import { Role } from '../../src/roles/role.entity';

const SKILLS = {
  'Build and CI tools': [
    'Capistrano',
    'Jenkins',
    'Make',
    'Rake',
    'Webpack',
    'Terraform',
  ],
  Databases: ['MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Redis'],
  Methods: ['ATTD', 'Scrum', 'Kanban', 'TDD', 'Waterfall'],
  Messaging: ['RabbitMQ', 'Kafka'],
  Cloud: ['ECE', 'Openshift', 'Openstack', 'AWS'],
  Mobile: ['Android', 'Ionic 2'],
  'Operating systems': ['Linux', 'Unix', 'Windows'],
  Programming: [
    'Erlang',
    'C#',
    'Switft',
    'PHP',
    'Python',
    'C++',
    'C',
    'Ruby',
    'Javascript',
    'Go',
    'Elixir',
    'Typescript',
    'Java',
  ],
  Ruby: ['Ruby on Rails'],
  Node: ['ExpressJS', 'KoaJS', 'Sequelize', 'NestJS', 'Typeorm'],
  Servers: ['Apache', 'Nginx', 'Passenger', 'Tomcat'],
  Testing: ['RSpec', 'Jest', 'Robot Framework', 'Cypress', 'Selenium', 'Mocha'],
  'UX and usability': [
    'Accessibility',
    'Information architecture',
    'Interaction',
    'Semantics',
    'Standards-compatibility',
  ],
  'Version control': ['Git'],
  Web: [
    'HAML',
    'Slim',
    'Less',
    'Sass',
    'jQuery',
    'KnockoutJS',
    'React',
    'Angular',
    'Angular 2',
    'Redux',
    'Vue.js',
  ],
  ['Other']: [
    'ElasticSearch',
    'Vim',
    'Apache Kafka',
    'Microservices',
    'Kubernetes',
    'GCP',
    'Agile',
    'Docker',
    'Ansible',
  ],
};

export default class Seed implements Seeder {
  private async generateSchools(
    factory: Factory,
    times = 10,
  ): Promise<School[]> {
    const schools = [];
    for (let i = 0; i < times; i++) {
      try {
        const school = await factory(School)().create();
        schools.push(school);
      } catch (err) {
        console.log(err);
        i = i - 1;
        continue;
      }
    }
    return schools;
  }

  private async generateCompanies(
    factory: Factory,
    times = 10,
  ): Promise<Company[]> {
    const companies = [];
    for (let i = 0; i < times; i++) {
      try {
        const company = await factory(Company)().create();
        companies.push(company);
      } catch (err) {
        console.log(err);
        i = i - 1;
        continue;
      }
    }
    return companies;
  }

  public async run(factory: Factory): Promise<void> {
    const adminRole = await factory(Role)().create({
      name: 'ADMIN',
    });

    const skillGroups: SkillGroup[] = [];
    const skillSubjects: SkillSubject[] = [];

    // Create skills and skill groups
    for (const skillGroupName of Object.keys(SKILLS)) {
      const skillGroup: SkillGroup = await factory(SkillGroup)().create({
        name: skillGroupName,
      });
      skillGroups.push(skillGroup);

      for (const name of SKILLS[skillGroupName]) {
        const skillSubject: SkillSubject = await factory(
          SkillSubject,
        )().create({ name, skillGroupId: skillGroup.id });
        skillSubjects.push(skillSubject);
      }
    }

    const testCompany = await factory(Company)().create({
      name: 'Test company',
    });
    await factory(Project)().create({
      name: 'Test project',
      company: testCompany,
    });

    await factory(School)().create({
      name: 'Test school',
    });

    // Create schools
    const schools = await this.generateSchools(factory);

    // Create companies
    const companies = await this.generateCompanies(factory);

    // Create projects
    const projects: Project[] = await factory(Project)()
      .map(async (project: Project) => {
        const company: Company = companies
          .sort(() => 0.5 - Math.random())
          .slice(0, 1)[0];
        project.company = company;

        return project;
      })
      .createMany(10);

    // Create admin user
    const admin = await factory(User)().make({
      firstName: 'John',
      lastName: 'Doe',
      username: 'admin',
      roles: [adminRole],
    });
    admin.password = await bcrypt.hash('Admin123', admin.salt);
    await admin.save();
    const adminCV = await factory(CV)().create({
      userId: admin.id,
      description: '',
    });
    let randomSkills: SkillSubject[] = skillSubjects
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
    for (const skillSubject of randomSkills) {
      await factory(Skill)().create({
        cvId: adminCV.id,
        skillSubjectId: skillSubject.id,
      });
    }

    // Create test automation user
    const testAutomationUser = await factory(User)().make({
      firstName: 'Bob',
      lastName: 'Test',
      username: 'bobtest',
    });
    testAutomationUser.password = await bcrypt.hash(
      'BobTest123',
      testAutomationUser.salt,
    );
    await testAutomationUser.save();
    await factory(CV)().create({ userId: testAutomationUser.id });

    // Create CVs
    const cvs: CV[] = await factory(CV)()
      .map(async (cv: CV) => {
        const user: User = await factory(User)().create();
        cv.user = user;
        cv.skills = [];

        return cv;
      })
      .createMany(10);

    // Add skills
    for (const cv of cvs) {
      randomSkills = skillSubjects.sort(() => 0.5 - Math.random()).slice(0, 25);

      for (const skillSubject of randomSkills) {
        const skill = await factory(Skill)().create({
          cvId: cv.id,
          skillSubjectId: skillSubject.id,
        });

        cv.skills.push(skill);
      }
    }

    // Add educations
    for (const cv of cvs) {
      const randomSchools = schools.sort(() => 0.5 - Math.random()).slice(0, 3);

      for (const school of randomSchools) {
        await factory(Education)().create({ cvId: cv.id, schoolId: school.id });
      }
    }

    // Add work experiences
    for (const cv of cvs) {
      const randomCompanies = companies
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      for (const company of randomCompanies) {
        await factory(WorkExperience)().create({
          cvId: cv.id,
          companyId: company.id,
        });
      }
    }

    // Add project memberships
    for (const cv of cvs) {
      const randomProjects = projects
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      for (const project of randomProjects) {
        const projectMembership = await factory(ProjectMembership)().create({
          cvId: cv.id,
          projectId: project.id,
        });

        const randomSkills = cv.skills
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 10 + 3));

        for (const skill of randomSkills) {
          await factory(MembershipSkill)().create({
            skillId: skill.id,
            projectMembershipId: projectMembership.id,
          });
        }
      }
    }
  }
}
