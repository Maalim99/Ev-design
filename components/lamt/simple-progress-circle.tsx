import * as React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";

/**
 * LAMT SimpleProgressCircle Component
 * Migrated from @lamt/components SimpleProgressCircle.tsx
 */

export enum SimpleProgressCircleType {
  Normal = "normal",
  Success = "success",
  Danger = "danger",
}

export interface SimpleProgressCircleProps {
  type?: SimpleProgressCircleType;
  maxSize?: number;
  progress?: number;
  strokeWidth?: number;
  className?: string;
}

export const SimpleProgressCircle = React.forwardRef<
  HTMLDivElement,
  SimpleProgressCircleProps
>(
  (
    {
      type = SimpleProgressCircleType.Normal,
      maxSize = 100,
      progress = 0,
      strokeWidth = 7,
      className,
    },
    ref
  ) => {
    const pathColorMap = {
      [SimpleProgressCircleType.Normal]: "#92A5BA",
      [SimpleProgressCircleType.Success]: "#1D9E75",
      [SimpleProgressCircleType.Danger]: "#FF4507",
    };

    const pathColor = pathColorMap[type];

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          height: `${maxSize}px`,
          width: `${maxSize}px`,
        }}
      >
        <CircularProgressbar
          value={progress}
          text={`${progress || 0}%`}
          strokeWidth={strokeWidth}
          styles={buildStyles({
            pathColor,
            textColor: "#92A5BA",
          })}
        />
      </div>
    );
  }
);

SimpleProgressCircle.displayName = "SimpleProgressCircle";

export default SimpleProgressCircle;
