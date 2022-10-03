import WorkspaceHeader from "./WorkspaceHeader";
import SlideCanvas from "./SlideCanvas";

import SlideNotes from "./SlideNotes";

function Workspace() {
  return (
    <div className="scrowl__workspace support-high-contrast">
      <WorkspaceHeader />
      <div className="scrowl__workspace__body">
        <SlideCanvas />
      </div>
      <SlideNotes />
    </div>
  );
}

export default Workspace;
