/* eslint-disable jsx-a11y/anchor-is-valid */

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as courseActions } from "./../../store/slices/course";
import { actions as uiActions } from "./../../store/slices/ui";

import ContextMenu from "../../utils/ContextMenu";

export const showContextMenu = async (dispatch, courseId, resource, target?) => {
  ContextMenu.show(
    [
      {
        label: "Edit Resource",
        onClick: () =>
          dispatch(
            uiActions.showOverlay({
              type: "Resource",
              data: {
                id: resource.id,
              },
            })
          ),
      },
      {
        label: "Preview",
        onClick: async () => {
          await (window as any).ScrowlApp.showResourcePreview({ courseId, resource });
        },
      },

      { type: "separator" },
      {
        label: "Delete Resource",
        onClick: async () => {
          const dialogResult = await dispatch(
            uiActions.showDialog({
              buttons: ["Delete Resource", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: resource.name,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            dispatch(courseActions.deleteResource(resource.id));
          }
        },
      },
    ],
    target
  );
};

function Resources(props: any) {
  const dispatch = useAppDispatch();
  const _resources = useAppSelector((state) => state["course"].resources);
  const courseId = useAppSelector((state) => state["course"].course.id);

  const resources: any = [..._resources];
  resources.sort((a: any, b: any) => a.title.localeCompare(b.title));

  return (
    <div className={"tab-pane " + (props.active ? "active" : "")} role="tabpanel">
      <ul className="nav flex-column scrowl-resources" id="resourcesList">
        {resources.map((resource) => (
          <li
            key={resource.id}
            className="scrowl-resources__item"
            onContextMenu={() => {
              showContextMenu(dispatch, courseId, resource);
            }}
          >
            <a
              href="#"
              className="scrowl-resources__item__link"
              onClick={() => {
                dispatch(
                  uiActions.showOverlay({
                    type: "Resource",
                    data: {
                      id: resource.id,
                    },
                  })
                );
              }}
            >
              <span className="scrowl-resources__item__icon material-symbols-sharp">
                description
              </span>
              <span className="scrowl-resources__item__title">{resource.title}</span>
              <span className="scrowl-resources__item__description">{resource.description}</span>
            </a>
            <div className="owl-more-options dropdown">
              <button
                className="btn dropdown-toggle owl-more-options__button"
                type="button"
                onClick={(e: any) => {
                  e.target.blur();
                  showContextMenu(dispatch, courseId, resource, e.target);
                  e.preventDefault();
                }}
              >
                <span className="material-symbols-rounded">more_vert</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="owl-sticky-add-item">
        <button
          className="owl-sticky-add-item__button"
          onContextMenu={() =>
            dispatch(
              uiActions.showOverlay({
                type: "Resource",
                data: {
                  id: -1,
                },
              })
            )
          }
          onClick={() =>
            dispatch(
              uiActions.showOverlay({
                type: "Resource",
                data: {
                  id: -1,
                },
              })
            )
          }
        >
          <span className="txt-placeholder">Add a new resource...</span>
          <span className="material-symbols-rounded">attach_file</span>
        </button>
      </div>
    </div>
  );
}

export default Resources;
