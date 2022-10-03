import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { actions as uiActions } from "../../../store/slices/ui";
import { actions as courseActions } from "../../../store/slices/course";

import LeftOverlay from "../LeftOverlay";

function ResourceEditor(props: any) {
  const dispatch = useAppDispatch();

  const resourceResources = useAppSelector((state) => state["course"].resources);

  const data = props.data;
  const resourceData = resourceResources.find((resource) => resource.id === data.id);

  const [resourceTitle, setResourceTitle] = useState(resourceData ? resourceData.title : "");
  const [resourceURL, setResourceURL] = useState(resourceData ? resourceData.url : "");
  const [resourceDescription, setResourceDescription] = useState(
    resourceData ? resourceData.description : ""
  );

  return (
    <LeftOverlay
      {...props}
      className="resource-editor"
      title={data.id === -1 ? "Add New Resource" : "Edit Resource"}
      buttons={{ submit: "Save" }}
      onSubmit={() => {
        if (resourceTitle.trim() === "") {
          return;
        }

        // Remove double-newlines
        let cleanDescription = resourceDescription
          ? resourceDescription.replace(/\n{3,}/g, "\n\n")
          : "";
        if (data.id === -1) {
          dispatch(
            courseActions.addNewResource({
              title: resourceTitle.trim(),
              url: resourceURL,
              description: cleanDescription.trim(),
            })
          );
        } else {
          dispatch(
            courseActions.updateResource({
              id: data.id,
              title: resourceTitle.trim(),
              url: resourceURL,
              description: cleanDescription.trim(),
            })
          );
        }
        dispatch(uiActions.closeOverlay(true));
      }}
    >
      {/* <div className="mb-2">
        <label htmlFor="resourceAdd0" className="form-label">
          Resource
        </label>
        <input
          autoFocus
          type="text"
          className={"form-control " + (submitted && resourceTitle.trim() === "" ? "error" : "")}
          placeholder="Resource title"
          value={resourceTitle}
          onChange={(e) => {
            setResourceTitle(e.target.value);
          }}
        />
      </div> */}

      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control read-only"
          placeholder="File attachment"
          aria-label="File attachment"
          value={resourceTitle}
          onChange={(e) => {
            e.preventDefault();
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => {
              dispatch(
                uiActions.showOverlay({
                  type: "AssetBrowser",
                  data: {},
                  callback: (params) => {
                    if (typeof params === "object") {
                      const { asset, fileName } = params;
                      console.log("Asset Browser Results", params);

                      setResourceTitle(fileName);
                      setResourceURL(asset);
                    } else {
                    }
                  },
                })
              );
            }}
          >
            Browse
          </button>
        </div>
      </div>

      <div className="mb-2 owl-offcanvas-form__textarea">
        <label htmlFor="resourceAdd2" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          placeholder="Describe the resource"
          style={{ resize: "none" }}
          value={resourceDescription}
          onChange={(e) => {
            setResourceDescription(e.target.value);
          }}
        />
      </div>
    </LeftOverlay>
  );
}

export default ResourceEditor;
