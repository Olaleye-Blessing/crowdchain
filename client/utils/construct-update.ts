import { IUpdate } from "@/interfaces/update";
import { formatUnits } from "viem";

export const constructUpdate = (update: {
  id: bigint;
  title: string;
  timestamp: bigint;
  content: string;
}): IUpdate => {
  return {
    id: +formatUnits(update.id, 0),
    title: update.title,
    timestamp: +formatUnits(update.timestamp, 0) * 1000,
    content: update.content,
  };
};
