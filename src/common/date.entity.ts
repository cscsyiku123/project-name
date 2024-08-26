import { Column } from "typeorm";
import { formatTime } from "./utils";

export class DateEntity {
  @Column({
    name: "create_time", default: () => "CURRENT_TIMESTAMP", type: "datetime",
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => formatTime(value, "yyyy-MM-dd HH:mm:ss")
    }
  })
  createTime: Date;

  @Column({
    name: "update_time",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    type: "datetime",
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => formatTime(value, "yyyy-MM-dd HH:mm:ss")
    }
  })
  updateTime: Date;
}