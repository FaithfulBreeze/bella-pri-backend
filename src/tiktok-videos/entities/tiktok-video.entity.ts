import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TiktokVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  videoId: string;

  @Column({ unique: true })
  order: number;

  @Column({ default: false })
  highlighted: boolean;
}
