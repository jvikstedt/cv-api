import * as bcrypt from 'bcrypt';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { CV } from '../cv/cv.entity';
import { Template } from '../templates/template.entity';
import { File } from '../files/file.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @OneToOne(() => CV, cv => cv.user)
  cv: CV;

  @OneToMany(() => Template, template => template.user)
  templates: Template[];

  @OneToOne(() => File)
  @JoinColumn()
  avatar: File;

  @Column({ nullable: true })
  avatarId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash == this.password;
  }

  public constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}
