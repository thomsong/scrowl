import { useAppSelector } from "../../../../store/hooks";

import Accordion from "./Accordion";
function Overview() {
  const courseSlides = useAppSelector((state) => state["course"].slides);
  const courseLessons = useAppSelector((state) => state["course"].lessons);
  const courseModules = useAppSelector((state) => state["course"].modules);

  return (
    <Accordion title="Overview" disableCollapse defaultExpanded={true}>
      <dl className="scorm-publish-data">
        <div className="scorm-publish-data__item">
          <dt>{courseModules.length === 1 ? "Module" : "Modules"}</dt>
          <dd>{courseModules.length}</dd>
        </div>
        <div className="scorm-publish-data__item">
          <dt>{courseLessons.length === 1 ? "Lesson" : "Lessons"}</dt>
          <dd>{courseLessons.length}</dd>
        </div>
        <div className="scorm-publish-data__item">
          <dt>{courseSlides.length === 1 ? "Slide" : "Slides"}</dt>
          <dd>{courseSlides.length}</dd>
        </div>

        {/* <div className="scorm-publish-data__filesize">
          <hr />
          <dt>Estimated Size</dt>
          <dd>
            126<small>MB</small>
          </dd>
        </div> */}
      </dl>
    </Accordion>
  );
}

export default Overview;
