import Clock from "./Clock";
import AutoCompleteInput from "./AutoCompleteInput";

function Area({ isHere }: { isHere: boolean }) {
  return (
    <div id={isHere ? "here" : "there"} className="col-12 col-sm-6">
      <h2 className="my-3">{isHere ? "Your Location" : "Your Destination"}</h2>
      <AutoCompleteInput isHere={isHere} />
      <Clock isHere={isHere} />
    </div>
  );
}

export default Area;