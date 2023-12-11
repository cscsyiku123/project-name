import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonValidStatus, PostType } from "../../utils/constants";


export class BarrageRequest {

  startSecond: number;
  endSecond: number;
  videoId: number;



}
