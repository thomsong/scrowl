import React from "react";

interface InputProps {
  // Properties
  label: string;
  placeholder?: string;
  multiline?: boolean;
  autoGrow?: number; // Max number of lines to auto-grow to
  lines?: number; // The initial number of lines to show
  initialValue?: string;

  // Events
  onChange?: Function;
  onFocus?: Function;
  onBlur?: Function;
}

const defaultInputProps: InputProps = {
  label: "Input Label",
  placeholder: "Enter a value...",
  multiline: false,
  autoGrow: 5,
  lines: 3,
};

function RangeSlider(_props: InputProps) {
  const props: any = { ...defaultInputProps, ..._props };

  React.useEffect(() => {}, []);

  return (
    <>
      <div className="input-group mb-3 input-group-sm">
        <button className="btn btn-outline-primary" type="button" id="button-addon1">
          -
        </button>
        <input
          type="text"
          className="form-control"
          aria-label="Example text with button addon"
          aria-describedby="button-addon1"
        />
        <button className="btn btn-outline-primary" type="button" id="button-addon1">
          +
        </button>
      </div>

      <div className="input-group mb-3 input-group-sm">
        <div className="input-group-text">
          <input
            className="form-check-input mt-0"
            type="checkbox"
            aria-label="Checkbox for following text input"
          />
        </div>
        <input type="text" className="form-control" aria-label="Text input with checkbox" />
      </div>

      <div className="mb-2 input-group-sm">
        <label htmlFor="customRange1" className="form-label">
          {props.label}
        </label>
        <input
          type="range"
          className="form-range"
          id="customRange1"
          // value="5"
          min="0"
          max="10"
          step="1"
          // onChange={() => {}}
        />

        <div className="input-group flex-nowrap input-group-sm">
          <span className="input-group-text" id="addon-wrapping">
            @
          </span>

          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
      </div>
    </>
  );
}

export default RangeSlider;
