import { useAppSelector } from "../../../../store/hooks";

import Accordion from "./Accordion";
function ReportingTracking(props: any) {
  const publishSettings = props.publishSettings;

  const courseData = useAppSelector((state) => state["course"].course);

  const lmsIdentifier = publishSettings.lmsIdentifier || courseData.id;
  return (
    <Accordion title="Reporting &amp; Tracking" defaultExpanded={props.defaultExpanded}>
      <div className="row mb-2">
        <label htmlFor="publish5" className="col-5 form-label col-form-label col-form-label-sm">
          Report Status to LMS as
        </label>
        <div className="col-7">
          <select className="form-select form-select-sm" defaultValue="Passed/Incomplete">
            <option>Passed/Incomplete</option>
          </select>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-5 form-label col-form-label col-form-label-sm">LMS Identifier</label>
        <div className="col-7">
          <input
            type="text"
            className="form-control form-control-sm"
            value={lmsIdentifier}
            onChange={(e) => {
              if (e.target.value === courseData.id) {
                props.onChange("lmsIdentifier", "");
              } else {
                props.onChange("lmsIdentifier", e.target.value);
              }
            }}
          />
        </div>
      </div>
    </Accordion>
  );
}

export default ReportingTracking;
