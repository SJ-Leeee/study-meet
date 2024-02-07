import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'reports' })
export class Reports {
  @PrimaryGeneratedColumn({ type: 'int', name: 'reportId' })
  reportId: number;

  @Column('text', { name: 'reportDetail' })
  reportDetail: string;

  @Column('text', { name: 'reportImagePath' })
  reportImagePath: string;

  // 튜터인포아이디 ManyToOne
}
