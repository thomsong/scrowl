import Accordion from "./Accordion";
function ExportOptions(props: any) {
  return (
    <Accordion title="Export Options" defaultExpanded={props.defaultExpanded}>
      <div className="row mb-2">
        <label htmlFor="publish4" className="col-5 form-label col-form-label col-form-label-sm">
          Output Format
        </label>
        <div className="col-7">
          <select className="form-select form-select-sm" defaultValue="scorm_2004">
            <option value="scorm_2004">SCORM 2004</option>
            <option disabled value="pdf">
              PDF
            </option>
          </select>
        </div>
      </div>
      <div className="row mb-2">
        <label htmlFor="publish11" className="col-5 form-label col-form-label col-form-label-sm">
          Optimize Media
        </label>
        <div className="col-7">
          <select className="form-select form-select-sm" defaultValue="recommended">
            <option disabled value="none">
              None
            </option>
            <option value="recommended">Recommended</option>
            <option disabled value="maximum">
              Maximum
            </option>
          </select>
        </div>
      </div>
    </Accordion>
  );
}

export default ExportOptions;
