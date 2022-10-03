import { useAppSelector } from "../../../../store/hooks";

import Accordion from "./Accordion";
function CourseSettings(props: any) {
  const publishSettings = props.publishSettings;

  const courseData = useAppSelector((state) => state["course"].course);

  const courseName = publishSettings.name || courseData.name;
  return (
    <Accordion title="Course Settings" defaultExpanded={props.defaultExpanded}>
      <div className="mb-2">
        <label className="form-label">Course Name</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Choose a name"
          value={courseName}
          onChange={(e) => {
            if (e.target.value === courseData.name) {
              props.onChange("name", "");
            } else {
              props.onChange("name", e.target.value);
            }
          }}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Course Description</label>
        <textarea
          className="form-control form-control-sm"
          placeholder="Write a description"
          value={publishSettings.description}
          onChange={(e) => {
            props.onChange("description", e.target.value);
          }}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Authors</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Course authors"
          value={publishSettings.authors}
          onChange={(e) => {
            props.onChange("authors", e.target.value);
          }}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Organization</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Organization name"
          value={publishSettings.organization}
          onChange={(e) => {
            props.onChange("organization", e.target.value);
          }}
        />
      </div>
    </Accordion>
  );
}

export default CourseSettings;
