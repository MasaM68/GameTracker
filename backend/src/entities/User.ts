import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WatchStatus } from "./WatchStatus";

@Index("uq_user_username", ["username"], { unique: true })
@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_id", ["id"], { unique: true })
@Entity("user", { schema: "wad_exam_db" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", unique: true, length: 255 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @OneToOne(() => WatchStatus, (watchStatus) => watchStatus.user)
  watchStatus: WatchStatus;
}
