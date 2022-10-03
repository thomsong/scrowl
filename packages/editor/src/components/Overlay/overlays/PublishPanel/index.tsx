import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { actions as uiActions } from "./../../../../store/slices/ui";
import { actions as courseActions } from "./../../../../store/slices/course";

import CourseSettings from "./CourseSettings";
import ReportingTracking from "./ReportingTracking";
import ExportOptions from "./ExportOptions";
import Overview from "./Overview";

import RightOverlay from "../../RightOverlay";

function PublishPanel(props: any) {
  const dispatch = useAppDispatch();

  const publishSettings = useAppSelector((state) => state["course"].publish);

  const updatePublishSetting = (key, value) => {
    dispatch(courseActions.setPublishSetting({ key, value }));
  };
  return (
    <RightOverlay
      {...props}
      title={"Publish Course"}
      buttons={{ submit: "Publish" }}
      onSubmit={async () => {
        dispatch(
          uiActions.showOverlay({
            type: "PublishProgress", //PublishProgress
            data: {
              canClose: false,
            },
          })
        );

        await dispatch(courseActions.saveCourse(false));
        const publishResults = await dispatch(courseActions.publishCourse({}));

        dispatch(uiActions.closeOverlay(true)); // Close Progress modal

        if (!publishResults.payload) {
          return;
        }

        await new Promise((resolve) => {
          window.requestAnimationFrame(async () => {
            dispatch(uiActions.closeOverlay(true));
            resolve(true);
          });
        });

        new Notification("Publish Successful", {
          body: "Your course was published successfully",
        }).onclick = () => {
          (window as any).ScrowlApp.showRecentPublishedFile();
        };

        window.requestAnimationFrame(async () => {
          const isFirstPublish = await (window as any).ScrowlApp.settings.get(
            "first_publish",
            true
          );

          if (isFirstPublish) {
            dispatch(
              uiActions.showOverlay({
                type: "FirstPublish",
                data: {},
              })
            );

            await (window as any).ScrowlApp.settings.set("first_publish", false);
          }
        });
      }}
    >
      <div className="accordion">
        <CourseSettings
          defaultExpanded
          publishSettings={publishSettings}
          onChange={updatePublishSetting}
        />
        <ReportingTracking
          _defaultExpanded
          publishSettings={publishSettings}
          onChange={updatePublishSetting}
        />
        <ExportOptions
          _defaultExpanded
          publishSettings={publishSettings}
          onChange={updatePublishSetting}
        />
        <Overview />
      </div>
    </RightOverlay>
  );
}

export default PublishPanel;
