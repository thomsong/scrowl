import React from "react";
import Templater from "./templater";

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
  placeholder: "Enter a value...",

  focus: false,
  validationError: "",

  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

function NumberSpinner(_props: InputProps) {
  const props: any = { ...defaultInputProps, ..._props };

  const inputRef: any = React.useRef();
  const lastFocusState: any = React.useRef(false);

  React.useEffect(() => {}, []);

  if (inputRef.current && lastFocusState.current !== props.focus) {
    lastFocusState.current = props.focus;

    if (props.focus) {
      inputRef.current.focus();
    }
  }

  let cleanVal = props.value;
  if (cleanVal && props.template) {
    cleanVal = Templater(cleanVal, props.template);
  }

  const validationError: any = props.validationError;

  const inputProps: any = {
    ref: inputRef,
    type: "text",
    className: "form-control form-control-sm " + (validationError !== "" ? "is-invalid" : ""),
    disabled: props.disabled,
    value: cleanVal,

    onFocus: (e: any) => {
      // Placeholder
    },

    onChange: (e: any) => {
      // Placeholder
    },
  };

  let minValue = parseInt(props.min) || 1;
  let maxValue = parseInt(props.max) || Number.POSITIVE_INFINITY;

  return (
    <div className={"mb-2"}>
      <label className="form-label">{props.label}</label>
      <div className={"input-group input-group-sm " + (validationError !== "" ? "is-invalid" : "")}>
        <button
          style={{ width: "25%", maxWidth: "75px" }}
          className="btn btn-outline-primary pre"
          type="button"
          disabled={props.disabled}
          onClick={(e: any) => {
            let cleanValue = parseInt(inputRef.current.value) - 1;
            if (cleanValue < minValue) {
              cleanValue = minValue;
            } else if (cleanValue > maxValue) {
              cleanValue = maxValue;
            }
            props.onChange(cleanValue);
            props.onValidate(cleanValue);
          }}
          onMouseUp={(e: any) => {
            e.target.blur();
          }}
        >
          <span
            style={{
              fontSize: "15px",
            }}
            className="material-symbols-sharp"
          >
            remove
          </span>
        </button>
        <input
          tabIndex="-1"
          style={{ pointerEvents: "none", textAlign: "center" }}
          {...inputProps}
        />
        <button
          style={{ width: "25%", maxWidth: "75px" }}
          className="btn btn-outline-primary post"
          type="button"
          disabled={props.disabled}
          onClick={(e: any) => {
            let cleanValue = parseInt(inputRef.current.value) + 1;
            if (cleanValue < props.min) {
              cleanValue = props.min;
            } else if (cleanValue > props.max) {
              cleanValue = props.max;
            }
            props.onChange(cleanValue);
            props.onValidate(cleanValue);
          }}
          onMouseUp={(e: any) => {
            e.target.blur();
          }}
        >
          <span
            style={{
              fontSize: "15px",
            }}
            className="material-symbols-sharp"
          >
            add
          </span>
        </button>
      </div>
      {validationError !== "" ? <div className="invalid-feedback">{validationError}</div> : null}
    </div>
  );
}

export default NumberSpinner;
