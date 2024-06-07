import React, { FC } from "react";
import Skeleton from "../Skeleton/Skeleton";

export interface Card18TcgSkeletonProps {
  className?: string;
  ratio?: string;
}

const Card18TcgSkeleton: FC<Card18TcgSkeletonProps> = ({
  className = "h-full",
  ratio = "aspect-w-4 aspect-h-3",
}) => {
  return (
    <div
      className={`nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
    >
      <div
        className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
      >
        <div>
          <Skeleton
            width="100%"
            height="100%"
            containerClassName="absolute inset-0 leading-none"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col space-y-3">
        <Skeleton width="60%" />
        <h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
          <Skeleton />
        </h3>
        <Skeleton width="80%" />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
        <Skeleton width="30%" />
      </div>
    </div>
  );
};

export default Card18TcgSkeleton;
