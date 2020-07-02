import { BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  destination: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<File>) {
    super();
    Object.assign(this, init);
  }
}
