import { useState, useEffect } from "react";
import { useLocation } from "./Location";

export default function Clock({ isHere }: { isHere: boolean }) {
  const [time, setTime] = useState<Date>(new Date());
  const { hereOffset, thereOffset } = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date();
      if (isHere && hereOffset) {
        time.setSeconds(time.getSeconds() + hereOffset.offset);
      }
      if (!isHere && thereOffset) {
        time.setSeconds(time.getSeconds() + thereOffset.offset);
      }
      setTime(time)
    }, 1000);
    return () => { clearInterval(timer); };
  }, [hereOffset, thereOffset]);

  return (
    <div>
      <p className="pt-3">
        Datetime: {(() => {
          if ((isHere && hereOffset) || (!isHere && thereOffset)) {
            return time.toUTCString().substring(5, 25);
          } else return null;
        })()}
      </p>
      <p>
        Timezone: {(() => {
          if (isHere && hereOffset) return hereOffset.timezone;
          else if (!isHere && thereOffset) return thereOffset.timezone;
          else return null;
        })()}
      </p>
    </div>
  );
}