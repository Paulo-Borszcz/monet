export type DowntimeStatus = "open" | "closed";
export type IpType = "switch" | "ata";

export interface IDowntime {
  id: number;
  branchId: number | null;
  ipType: IpType;
  startTime: Date | null;
  endTime?: Date | null;
  status: DowntimeStatus | null;
}
