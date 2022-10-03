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

function ColorPicker(_props: InputProps) {
  React.useEffect(() => {}, []);

  return (
    <>
      <div className="mb-2 form-color">
        {/* <input className="form-check-input" type="checkbox" /> */}

        <input
          type="color"
          className="form-control form-control-color form-control-sm"
          defaultValue="#563d7c"
          id="exampleColorInput"
          title="Choose your color"
        />

        <label htmlFor="exampleColorInput" className="form-check-label">
          Indeterminate checkbox
        </label>
      </div>
    </>
  );
}

export default ColorPicker;
