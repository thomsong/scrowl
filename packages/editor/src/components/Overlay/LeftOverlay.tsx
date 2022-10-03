import { useEffect } from "react";
import { motion } from "framer-motion";

import { useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";

function LeftOverlay(props: any) {
  const dispatch = useAppDispatch();

  let buttonProps = { cancel: "Cancel", submit: "Submit", ...props.buttons };
  let onSubmit = props.onSubmit ? props.onSubmit : function () {};

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.target.nodeName === "INPUT" || event.target.nodeName === "TEXTAREA") {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        dispatch(uiActions.closeOverlay(true));
      }
    };

    if (props.topOverlay) {
      document.addEventListener("keydown", keyDownHandler);
    }

    // cleanup
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [dispatch, props.topOverlay]);

  const reducedAnimations = props.reducedAnimations;

  return (
    <motion.div
      style={{ zIndex: props.zIndex, left: 0 }}
      className={
        "offcanvas offcanvas-start show left-overlay-panel support-high-contrast " + props.className
      }
      initial={reducedAnimations ? { left: 0 } : { left: "calc(-1 * var(--bs-offcanvas-width))" }}
      animate={reducedAnimations ? {} : { left: 0 }}
      exit={
        reducedAnimations
          ? {}
          : {
              transition: { left: { duration: 0.15 } },
              left: "calc(-1 * var(--bs-offcanvas-width))",
            }
      }
      transition={reducedAnimations ? {} : { left: { duration: 0.25 } }}
    >
      <div className="offcanvas-header">
        <h4 className="offcanvas-title mb-0">{props.title}</h4>
        <button
          type="button"
          className="btn-close"
          onClick={(e) => {
            dispatch(uiActions.closeOverlay(true));
            e.preventDefault();
          }}
        />
      </div>

      <div className="offcanvas-body">
        <form className="owl-offcanvas-form">
          {props.children}

          <footer className="d-flex justify-content-end my-3">
            {buttonProps.cancel ? (
              <button
                type="button"
                className="btn btn-link"
                onClick={(e) => {
                  dispatch(uiActions.closeOverlay(true));
                  e.preventDefault();
                }}
              >
                {buttonProps.cancel}
              </button>
            ) : null}
            <button
              className="btn btn-success"
              type="submit"
              onClick={(e) => {
                onSubmit();
                e.preventDefault();
              }}
            >
              {buttonProps.submit}
            </button>
          </footer>
        </form>
      </div>
    </motion.div>
  );
}

export default LeftOverlay;
