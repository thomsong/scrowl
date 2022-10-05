import { useState, useRef, useEffect, useId } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { actions as uiActions } from "./../../../store/slices/ui";

import OverlayModal from "../OverlayModal";

function ResourceEditor(props: any) {
  const id = useId();

  const dispatch = useAppDispatch();

  const templates: any = useAppSelector((state) => state["course"].templates);
  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);

  const bodyRef: any = useRef();
  const selectedBttonRef: any = useRef();

  const [selectedKey, setSelectedKey] = useState(selectedSlide ? selectedSlide.templateName : "");

  const templatesComponents: any = [];

  // Sroll template into view on load
  useEffect(() => {
    if (!selectedBttonRef.current) {
      return;
    }
    const bodyBounds = bodyRef.current.getBoundingClientRect();
    const buttonBounds = selectedBttonRef.current.getBoundingClientRect();

    let newScroll =
      buttonBounds.bottom -
      bodyBounds.top +
      6 -
      bodyRef.current.clientHeight +
      bodyRef.current.scrollTop;

    bodyRef.current.scrollTop = newScroll;
  }, [selectedBttonRef]);

  templates.forEach((template) => {
    const isSelected = template.key === selectedKey;

    if (template.active === false) {
      return;
    }

    templatesComponents.push(
      <button
        key={template.key}
        ref={isSelected ? selectedBttonRef : null}
        className={"scrowl-template-browser__item " + (isSelected ? " active " : "")}
        id={id + ":" + template.key}
        onClick={(e) => {
          e.preventDefault();
          setSelectedKey(template.key);
        }}
      >
        <span
          className="material-symbols-sharp color-template"
          style={{
            display: "block",
            width: "100%",
            background: "white",
            height: "94px",
            color: "#d4d4d4",
            fontSize: "95px",
            textAlign: "center",
          }}
        >
          {template.icon}
        </span>

        <span className="scrowl-template-browser__item__type">
          <span className="material-symbols-sharp color-template">dashboard</span>
        </span>
        <label htmlFor={id + ":" + template.key}>
          <span>{template.name}</span>
          <small style={{ fontSize: "0.5rem", color: "#999" }}> v{template.version}</small>
        </label>
        {isSelected ? (
          <span className="scrowl-template-browser__item__active material-symbols-outlined">
            check_circle
          </span>
        ) : null}
      </button>
    );
  });

  return (
    <OverlayModal
      {...props}
      title={"Template Browser"}
      buttons={{ submit: "Select Template" }}
      ref={bodyRef}
      size="lg"
      onSubmit={() => {
        if (selectedKey !== selectedSlide.templateName) {
          dispatch(uiActions.closeOverlay({ templateName: selectedKey, templateVersion: "1.0" }));
          return;
        }

        dispatch(uiActions.closeOverlay(false));
      }}
      className="scrowl-template-browser-body"
    >
      <div className="scrowl-template-browser">{templatesComponents}</div>
    </OverlayModal>
  );
}

export default ResourceEditor;
