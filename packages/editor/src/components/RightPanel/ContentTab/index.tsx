import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { actions as courseActions } from "../../../store/slices/course";

import ClientProxy from "../../SlideRenderer/SlideHost/ClientProxy";

import FormBuilder from "./FormBuilder";

function ContentTab() {
  const dispatch = useAppDispatch();

  const contentLayout = useAppSelector((state) => state["course"].contentLayout);
  const selectedSlide = useAppSelector((state) => state["course"].selectedSlide);

  let slideContent = {};
  if (selectedSlide) {
    slideContent = selectedSlide.content;
  }

  const layoutState = contentLayout && contentLayout.state ? contentLayout.state : {};
  const dispatchTemplateEvent = async (eventType, fieldKey, value, props?) => {
    const templateUpdateResult: any = await ClientProxy.sendMessage("template." + eventType, {
      fieldKey,
      value,
      layoutState,
      props,
      slide: selectedSlide,
    });

    return templateUpdateResult;
  };

  return (
    <div className="content-form">
      <FormBuilder
        schema={contentLayout ? contentLayout.schema : {}}
        content={slideContent}
        onChange={async (fieldKey, value) => {
          dispatch(courseActions.setSlideContent({ fieldKey, value }));
        }}
        onValidate={async (fieldKey, value) => {
          dispatch(courseActions.setSlideContent({ fieldKey, value }));
          dispatch(courseActions.validateSlideContent({}));
        }}
        onFocus={async (fieldKey, value, props) => {
          return await dispatchTemplateEvent("onFocus", fieldKey, value, props);
        }}
        onBlur={async (fieldKey, value) => {
          dispatch(courseActions.setContentPanelFocus(""));

          return await dispatchTemplateEvent("onBlur", fieldKey, value);
        }}
        revertErrors={false}
      />
    </div>
  );
}

export default ContentTab;
