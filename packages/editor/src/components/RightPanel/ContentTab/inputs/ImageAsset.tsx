import React from "react";

import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { actions as uiActions } from "./../../../../store/slices/ui";

interface InputProps {
  // Properties
  label: string;
  placeholder?: string;

  focus: boolean;
  validationError: string;

  // Events
  onChange: Function;
  onValidate: Function;
  onFocus: Function;
  onBlur: Function;
}

const defaultInputProps: InputProps = {
  label: "Input Label",
  placeholder: "Select an image...",
  focus: false,
  validationError: "",

  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

function ImageAsset(_props: InputProps) {
  const dispatch = useAppDispatch();

  const props: any = { ...defaultInputProps, ..._props };

  const inputRef: any = React.useRef();
  const lastFocusState: any = React.useRef(false);

  const assets = useAppSelector((state) => state["course"].assets);

  const validationError: any = props.validationError;

  const showAssetBrowser = () => {
    props.onFocus();

    // console.log("props", props);
    dispatch(
      uiActions.showOverlay({
        // type: "Publish",
        type: "AssetBrowser",
        data: { filter: props.assetType || "" },
        callback: (params) => {
          if (typeof params === "object") {
            const { asset } = params;
            // console.log("Asset Browser Results", asset);

            window.requestAnimationFrame(() => {
              props.onChange(asset);
              props.onValidate(asset);
              props.onBlur();
            });
          } else {
            window.requestAnimationFrame(() => {
              props.onBlur();
            });
          }
        },
      })
    );
  };

  if (inputRef.current && lastFocusState.current !== props.focus) {
    lastFocusState.current = props.focus;

    if (props.focus) {
      // requestAnimationFrame fixes a state update bug
      window.requestAnimationFrame(() => {
        showAssetBrowser();
      });
    }
  }

  const valueHash = props.value.split(".").shift();
  const assetName = assets.reduce((a, p) => {
    return p.fileHash === valueHash ? p.fileName : a;
  }, "");

  const inputProps: any = {
    type: "text",
    className: "form-control form-control-sm" + (validationError !== "" ? " is-invalid " : ""),
    style: { cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis" },
    value: assetName,
    placeholder: props.placeholder,
    disabled: props.disabled,
    tabIndex: "-1",

    onChange: (e: any) => {},
    onFocus: (e: any) => {
      e.preventDefault();
      e.target.blur();
    },

    onClick: (e: any) => {
      showAssetBrowser();
    },
  };

  return (
    <div className={"mb-2 template-content-input " + (props.disabled ? " disabled " : "")}>
      <label className="form-label">{props.label}</label>
      <div className={"input-group input-group-sm " + (validationError !== "" ? "is-invalid" : "")}>
        {/* {groupElement("pre", props.pre)} */}

        {assetName ? (
          <button
            style={{ width: "26px", paddingLeft: "5px" }}
            className="btn btn-outline-primary post"
            type="button"
            disabled={props.disabled}
            onClick={(e: any) => {
              props.onChange("");
              props.onValidate("");
            }}
            onMouseUp={(e: any) => {
              e.target.blur();
            }}
            onBlur={() => {
              props.onBlur();
            }}
          >
            <span
              style={{
                fontSize: "15px",
              }}
              className="material-symbols-sharp"
            >
              close
            </span>
          </button>
        ) : null}

        <input {...inputProps} />

        <button
          ref={inputRef}
          style={{ width: "25%", maxWidth: "75px" }}
          className="btn btn-outline-primary post"
          type="button"
          disabled={props.disabled}
          onClick={(e: any) => {
            showAssetBrowser();
          }}
          onMouseUp={(e: any) => {
            e.target.blur();
          }}
          onBlur={() => {
            props.onBlur();
          }}
        >
          Select
        </button>
      </div>
      {validationError !== "" ? <div className="invalid-feedback">{validationError}</div> : null}
    </div>
  );
}

export default ImageAsset;
