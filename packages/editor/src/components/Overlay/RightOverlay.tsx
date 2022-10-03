import { useEffect } from "react";
import { motion } from "framer-motion";

import { useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";

function RightOverlay(props: any) {
  const dispatch = useAppDispatch();

  let buttonProps = {
    altSubmit: false,

    cancel: "Cancel",
    cancelClass: "link",

    submit: "Submit",
    submitClass: "success",

    align: "end",

    ...props.buttons,
  };
  let onAltSubmit = props.onAltSubmit ? props.onAltSubmit : function () {};
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

  // let bs_offcanvas_width = "400px";

  // if (document.querySelector(".offcanvas")) {
  //   bs_offcanvas_width = getComputedStyle(
  //     document.querySelector(".offcanvas") as any
  //   ).getPropertyValue("--bs-offcanvas-width");
  // }

  const reducedAnimations = props.reducedAnimations;

  // console.log("bs_offcanvas_width", bs_offcanvas_width);
  return (
    <motion.div
      style={{ zIndex: props.zIndex, right: 0 }}
      className={
        "offcanvas offcanvas-start show right-overlay-panel support-high-contrast " +
        props.className
      }
      initial={{ right: "-500px" }} //"-" + bs_offcanvas_width }}
      animate={{ right: "0px" }}
      exit={{
        transition: { right: { duration: 0.15 } },
        right: "-500px",
      }}
      transition={{ right: { duration: reducedAnimations ? 0 : 0.25 } }}
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

          <footer
            className="d-flex justify-content-end my-3"
            style={{ width: "calc(100% - 2rem)" }}
          >
            {buttonProps.altSubmit ? (
              <div style={{ flexGrow: "1" }}>
                <button
                  type="button"
                  className={"btn btn-link add-folder"}
                  onClick={(e) => {
                    onAltSubmit();
                    e.preventDefault();
                  }}
                >
                  {buttonProps.altSubmit}
                </button>
              </div>
            ) : null}
            {buttonProps.cancel ? (
              <button
                type="button"
                className={"btn btn-" + buttonProps.cancelClass}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(uiActions.closeOverlay(true));
                }}
              >
                {buttonProps.cancel}
              </button>
            ) : null}
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
          </footer>
        </form>
      </div>
    </motion.div>
  );
}

export default RightOverlay;
