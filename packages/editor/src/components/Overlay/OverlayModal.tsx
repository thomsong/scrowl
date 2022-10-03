import React, { useEffect } from "react";

import { useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";

const OverlayModal = React.forwardRef((props: any, ref: any) => {
  const dispatch = useAppDispatch();

  let buttonProps = {
    cancel: "Cancel",
    cancelClass: "link",

    submit: "Submit",
    submitClass: "success",

    align: "end",

    ...props.buttons,
  };
  let onSubmit = props.onSubmit ? props.onSubmit : function () {};

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.target.nodeName === "INPUT" || event.target.nodeName === "TEXTAREA") {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();

        if (props.canClose === false) {
          // Nope
        } else {
          dispatch(uiActions.closeOverlay(true));
        }
      }
    };

    if (props.topOverlay) {
      document.addEventListener("keydown", keyDownHandler, { capture: true });
    }

    // cleanup
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let modalSize = props.size || "md";

  return (
    <div
      className={"modal support-high-contrast"}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      style={{ zIndex: props.zIndex, display: "block" }}
    >
      <div className={"modal-dialog modal-" + modalSize + " modal-dialog-centered"}>
        <div className="modal-content ">
          {props.minimalUI ? null : (
            <div className="offcanvas-header">
              <h5 className="offcanvas-title mb-0">{props.title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={(e) => {
                  dispatch(uiActions.closeOverlay(true));
                  e.preventDefault();
                }}
              />
            </div>
          )}
          <form className="owl-offcanvas-form">
            <div className={"offcanvas-body " + props.className} ref={ref}>
              {props.children}
            </div>
            {!props.minimalUI ? (
              <footer className={"d-flex justify-content-" + buttonProps.align + " p-3 "}>
                {buttonProps.cancel ? (
                  <button
                    type="button"
                    className={"btn btn-" + buttonProps.cancelClass}
                    onClick={(e) => {
                      dispatch(uiActions.closeOverlay(true));
                      e.preventDefault();
                    }}
                  >
                    {buttonProps.cancel}
                  </button>
                ) : null}

                {buttonProps.submit ? (
                  <button
                    className={"btn btn-" + buttonProps.submitClass}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    {buttonProps.submit}
                  </button>
                ) : null}
              </footer>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
});

export default OverlayModal;
