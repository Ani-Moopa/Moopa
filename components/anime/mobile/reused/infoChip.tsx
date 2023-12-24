import React, { CSSProperties, FC } from "react";
import { getFormat } from "@/utils/getFormat";

interface Info {
  episodes?: number;
  averageScore?: number;
  format?: string;
  status?: string;
}

interface InfoChipProps {
  info: Info;
  color: any;
  className: string;
}

const InfoChip: FC<InfoChipProps> = ({ info, color, className }) => {
  return (
    <div
      className={`flex-wrap w-full justify-start md:pt-1 gap-4 ${className}`}
    >
      {info?.episodes && (
        <div
          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
          style={color}
        >
          {info?.episodes} Episodes
        </div>
      )}
      {info?.averageScore && (
        <div
          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
          style={color}
        >
          {info?.averageScore}%
        </div>
      )}
      {info?.format && (
        <div
          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
          style={color}
        >
          {getFormat(info?.format)}
        </div>
      )}
      {info?.status && (
        <div
          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
          style={color}
        >
          {info?.status}
        </div>
      )}
    </div>
  );
};

export default InfoChip;
