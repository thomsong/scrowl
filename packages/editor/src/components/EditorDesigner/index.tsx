import React from "react";

import GlobalToolbar from "../GlobalToolbar";
import GlobalStatusBar from "../GlobalStatusBar";

import Workspace from "../Workspace";

import LeftPanel from "../LeftPanel";
import RightPanel from "../RightPanel";
import Overlay from "../Overlay";

function EditorDesigner(props: any) {
  return (
    <div className="scrowl" role="main">
      <Overlay />
      <GlobalToolbar />
      <LeftPanel />

      <Workspace />
      <RightPanel />

      <GlobalStatusBar />
    </div>
  );
}

export default EditorDesigner;
