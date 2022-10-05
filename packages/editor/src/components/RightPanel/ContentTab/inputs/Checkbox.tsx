import React from "react";

import { LAYOUT_INPUT_TYPE, BaseInputProps, DefaultInputProps } from "./Types";

export interface InputProps extends BaseInputProps {
  options?: any;
}

const defaultInputProps: InputProps = {
  ...DefaultInputProps,

  type: LAYOUT_INPUT_TYPE.Checkbox,
  label: "Checkbox",
  options: [],
};

function Checkbox(_props: InputProps) {
  const props: InputProps = { ...defaultInputProps, ..._props };

  const inputRef: any = React.useRef();

  const lastFocusState: any = React.useRef(false);

  if (inputRef.current && lastFocusState.current !== props.focus) {
    lastFocusState.current = props.focus;

    if (props.focus) {
      inputRef.current.focus();
    }
  }

  const validationError: any = props.validationError;
  const isChecked = props.value ? true : false;

  const inputProps: any = {
    ref: inputRef,
    type: "text",
    className: "form-check-input " + (validationError !== "" ? " is-invalid " : ""),
    checked: isChecked,
    disabled: props.disabled,

    onChange: (e: any) => {
      let newValue = !isChecked;

      props.onChange(newValue);
      props.onValidate(newValue);
      props.onBlur(newValue);
    },

    onBlur: (e: any) => {
      props.onValidate(props.value);
      props.onBlur(props.value);
    },

    onFocus: (e: any) => {
      props.onFocus(props.value);
    },
  };

  return (
    <div className={"mb-2 " + (props.disabled ? " disabled " : "")} style={{ marginLeft: "5px" }}>
      <div className="form-check form-control-sm">
        <input {...inputProps} type="checkbox" />

        <label className="form-check-label">{props.label}</label>

        {validationError !== "" ? <div className="invalid-feedback">{validationError}</div> : null}
      </div>
    </div>
  );
}

export default Checkbox;
