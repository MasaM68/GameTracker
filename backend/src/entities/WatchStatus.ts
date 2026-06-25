import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("watch_status", { schema: "wad_exam_db" })
export class WatchStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "anime_id", unsigned: true })
  animeId: number;

  @Column("varchar", { name: "title", length: 255, nullable: true })
  title: string;

  @Column("varchar", { name: "image_url", length: 255, nullable: true })
  imageUrl: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "enum",
    enum: ["watching", "completed", "plan_to_watch", "dropped"],
    default: "plan_to_watch" 
  })
  status: string;

  @Column("tinyint", { name: "is_favorite", unsigned: true, default: 0 })
  isFavorite: number;

  @ManyToOne(() => User, (user) => user.watchStatus, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}