import React from "react";
import { groupElement } from "./GroupElement";
import Templater from "./templater";

interface InputProps {
  // Properties
  label: string;
  placeholder?: string;

  multiLine?: boolean;
  autoGrow?: number; // Max number of lines to auto-grow to
  lines?: number; // The initial number of lines to show

  maxLength?: number;
  initialValue?: string;
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

  multiLine: false,
  autoGrow: 5,
  lines: 3,

  maxLength: 500,
  focus: false,
  validationError: "",

  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

function autoSizeTextArea(textarea, minLines, maxLines) {
  const computedStyle = getComputedStyle(textarea);
  const lineHeight = parseFloat(computedStyle.getPropertyValue("line-height"));

  const paddingTop = parseFloat(computedStyle.getPropertyValue("padding-top"));
  const paddingBottom = parseFloat(computedStyle.getPropertyValue("padding-bottom"));
  const padding = paddingTop + paddingBottom + 2;

  const minHeight = lineHeight * Math.max(minLines, 1) + padding;
  const maxHeight = lineHeight * Math.max(maxLines, 1) + padding;

  textarea.style.height = "";
  textarea.style.height =
    Math.min(Math.max(minHeight, textarea.scrollHeight + 2), maxHeight) + "px";
}

function Textbox(_props: InputProps) {
  const props: any = { ...defaultInputProps, ..._props };

  const inputRef: any = React.useRef();
  const [revertValue, setRevertValue]: any = React.useState(null);
  const lastFocusState: any = React.useRef(false);

  React.useEffect(() => {
    props.multiLine && autoSizeTextArea(inputRef.current, props.lines, props.lines);
  }, [props.lines, props.multiLine]);

  if (inputRef.current && lastFocusState.current !== props.focus) {
    lastFocusState.current = props.focus;

    if (props.focus) {
      inputRef.current.focus();
    }
  }

  const validationError: any = props.validationError;

  const isChecked = !props.value.startsWith("disabled::");

  let cleanVal = props.value;
  if (cleanVal.startsWith("disabled::")) {
    cleanVal = cleanVal.substring(10);
  }

  if (revertValue === null) {
    if (cleanVal && props.template) {
      cleanVal = Templater(cleanVal, props.template);
    }
  }

  const inputProps: any = {
    ref: inputRef,
    type: "text",
    className: "form-control form-control-sm" + (validationError !== "" ? " is-invalid " : ""),

    value: cleanVal,
    placeholder: props.placeholder,
    disabled: props.disabled || !isChecked,

    maxLength: props.maxLength,

    onChange: (e: any) => {
      if (props.allowLinebreaks !== true) {
        // Likely to happen during a paste
        const regex = /\n+/g;
        e.target.value = e.target.value.replace(regex, " ");
      }

      const checkedValue = (isChecked ? "" : "disabled::") + e.target.value;
      props.onChange(checkedValue);
    },

    onBlur: (e: any) => {
      let bestValue = e.target.value;
      if (props.allowLinebreaks !== true) {
        const regex = /\n+/g;
        bestValue = bestValue.replace(regex, " ");
      } else {
        const regex = /\n(\n+)/g;
        bestValue = bestValue.replace(regex, "\n\n");
      }

      bestValue = bestValue.trim();

      e.target.scrollTop = 0;

      props.multiLine && autoSizeTextArea(e.target, props.lines, props.lines);

      const checkedValue = (isChecked ? "" : "disabled::") + bestValue;
      props.onValidate(checkedValue);

      props.onBlur(checkedValue);

      setRevertValue(null);
    },

    onFocus: (e: any) => {
      props.multiLine && autoSizeTextArea(e.target, props.lines, props.autoGrow);

      props.onFocus(e.target.value);
      setRevertValue(e.target.value);
    },

    onKeyDown: (e: any) => {
      if (e.key === "Enter") {
        if (props.multiLine && props.allowLinebreaks === true) {
          return;
        }

        e.target.blur();
        e.preventDefault();
        return;
      } else if (e.key === "Escape") {
        props.onChange(revertValue ? revertValue : "");
        e.target.blur();
        e.preventDefault();
        return;
      }
    },

    onInput: (e: any) => {
      if (props.allowLinebreaks !== true) {
        const regex = /\n+/g;
        e.target.value = e.target.value.replace(regex, " ");
      }

      props.multiLine && autoSizeTextArea(e.target, props.lines, props.autoGrow);
    },
  };

  return (
    <div
      className={
        "mb-2 template-content-input " +
        (props.disabled || (props.checkbox && !isChecked) ? " disabled " : "")
      }
    >
      <label className="form-label">{props.label}</label>
      <div className={"input-group input-group-sm " + (validationError !== "" ? "is-invalid" : "")}>
        {props.checkbox ? (
          <div className="input-group-text checkbox pre">
            <input
              disabled={props.disabled}
              checked={isChecked}
              className="form-check-input form-check-input-sm"
              type="checkbox"
              onChange={(e: any) => {
                let cleanVal = inputRef.current.value;
                if (cleanVal.startsWith("disabled::")) {
                  cleanVal = cleanVal.substring(10);
                }
                if (isChecked) {
                  props.onChange("disabled::" + cleanVal);
                } else {
                  props.onChange(cleanVal);
                }

                inputProps.onBlur({ target: inputRef.current });
              }}
            />
          </div>
        ) : (
          groupElement("pre", props.pre)
        )}
        {props.multiLine ? <textarea {...inputProps} /> : <input {...inputProps} />}
        {groupElement("post", props.post)}
      </div>
      {validationError !== "" ? <div className="invalid-feedback">{validationError}</div> : null}
    </div>
  );
}

export default Textbox;
