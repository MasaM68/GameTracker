import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("review", { schema: "wad_exam_db" })
export class Review {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "anime_id" })
  animeId: number;

  @Column("int", { name: "rating", unsigned: true })
  rating: number;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}