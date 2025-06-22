import { cn } from "@/lib/utils";
import { IconProps } from "./types";

const IconMap = ({ width = "30px", height = "30px", color = '#fff', className }: IconProps) => {
  return (
    <svg viewBox="0 0 100 100" height={height} width={width} className={cn(className, 'block flex-shrink-0')} transform="rotate(0)" fill={color}>
      <use xlinkHref="#take-the-tour-icon"></use>
    </svg>
  );
};
export default IconMap;