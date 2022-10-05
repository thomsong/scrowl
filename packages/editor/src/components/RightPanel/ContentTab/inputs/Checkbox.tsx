import React from "react";

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
  label: "Checkbox",

  focus: false,
  validationError: "",
  options: [],
  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

function Checkbox(_props: InputProps) {
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
