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

function CheckboxText(_props: InputProps) {
  React.useEffect(() => {}, []);
  return (
    <div className="input-group input-group-sm mb-2">
      <div className="input-group-text">
        <input
          className="form-check-input mt-0"
          type="checkbox"
          aria-label="Checkbox for following text input"
        />
      </div>
      <input type="text" className="form-control" aria-label="Text input with checkbox" />
    </div>
  );
}

export default CheckboxText;
