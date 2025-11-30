import { useState, useEffect } from "react";
import { useLocation } from "./Location";

export default function TimeDifference() {
  const [timediff, setTimediff] = useState<number | null>(null);
  const { hereOffset, thereOffset } = useLocation();

  useEffect(() => {
    if (hereOffset && thereOffset) {
      setTimediff(thereOffset.offset - hereOffset.offset);
    } else {
      setTimediff(null);
    }
  }, [hereOffset, thereOffset]);

  return (
    <div className="col-12">
      <p>Time Difference: {timediff && timediff / 3600 + " hours"}</p>
    </div>
  );
}