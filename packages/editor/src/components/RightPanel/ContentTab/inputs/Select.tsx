import React from "react";
import { groupElement } from "./GroupElement";

interface InputProps {
  // Properties
  label: string;

  initialValue?: string;
  focus: boolean;
  validationError: string;

  options: any;
  // Events
  onChange: Function;
  onValidate: Function;
  onFocus: Function;
  onBlur: Function;
}

const defaultInputProps: InputProps = {
  label: "Select Label",

  focus: false,
  validationError: "",

  options: [],

  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

function Select(_props: InputProps) {
  const props: any = { ...defaultInputProps, ..._props };

  const inputRef: any = React.useRef();

  const lastFocusState: any = React.useRef(false);

  if (inputRef.current && lastFocusState.current !== props.focus) {
    lastFocusState.current = props.focus;

    if (props.focus) {
      inputRef.current.focus();
    }
  }

  const validationError: any = props.validationError;

  let currentValue = props.value;
  if (!currentValue) {
    props.options.forEach((option) => {
      if (option.default) {
        currentValue = option.value;
      }
    });
  }

  const inputProps: any = {
    ref: inputRef,
    type: "text",
    className: "form-control form-control-sm" + (validationError !== "" ? " is-invalid " : ""),

    value: currentValue,
    disabled: props.disabled,

    onChange: (e: any) => {
      props.onChange(e.target.value);
      props.onValidate(e.target.value);
      props.onBlur(e.target.value);
    },

    onBlur: (e: any) => {
      props.onValidate(e.target.value);
      props.onBlur(e.target.value);
    },

    onFocus: (e: any) => {
      props.onFocus(e.target.value);
    },
  };

  return (
    <div className={"mb-2 template-content-input " + (props.disabled ? " disabled " : "")}>
      <label className="form-label">{props.label}</label>
      <div className={"input-group input-group-sm " + (validationError !== "" ? "is-invalid" : "")}>
        {groupElement("pre", props.pre)}
        <select {...inputProps}>
          {props.options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            );
          })}
        </select>
        {groupElement("post", props.post)}
      </div>
      {validationError !== "" ? <div className="invalid-feedback">{validationError}</div> : null}
    </div>
  );
}

export default Select;
