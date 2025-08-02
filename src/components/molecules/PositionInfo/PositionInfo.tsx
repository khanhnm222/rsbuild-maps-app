import { cn } from "@libs/style"
import { Alert, AlertDescription, AlertTitle } from "@components/atoms/ui/alert";
import { ReactNode } from "react"
import { DoorClosed } from "lucide-react";

interface PositionInfoProps {
  lng: string;
  lat: string;
  children?: ReactNode;
  className?: string;
  isAlert?: boolean;
  onClose?: () => void;
}
export function PositionInfo({ lng, lat, className, isAlert = true, onClose }: PositionInfoProps) {
  return (
    <>
      {isAlert ? (
        <Alert className={cn(className)}>
          <AlertTitle className="mb-4">Feature Infomation</AlertTitle>
          <AlertDescription className="flex gap-1">
            <span>Latitude: &nbsp;</span>{lat}{'°S |'}&nbsp;
            <span>Longitude: &nbsp;</span>{lng}{'°E'}
          </AlertDescription>
          < DoorClosed
            className="absolute top-1 h-5 w-5 p-[0.5px] flex place-self-end right-4 cursor-pointer rounded-full hover:bg-gray-50"
            onClick={() => onClose && onClose()}
          />
        </Alert>
      ) : (
        <div className={cn('absolute items-center bottom-0 w-auto p-2 rounded-full outline-none border-[1.5px] border-primary h-8 text-sm hidden sm:flex md:flex lg:flex')}>
          <span>Latitude: &nbsp;</span>{lat}{'°S |'}&nbsp;
          <span>Longitude: &nbsp;</span>{lng}{'°E'}
        </div>
      )}
    </>
  )
}
