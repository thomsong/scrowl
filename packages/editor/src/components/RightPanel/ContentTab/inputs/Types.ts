export type { InputProps as InputAssetProps } from "./Asset";
export type { InputProps as InputCheckboxProps } from "./Checkbox";
export type { InputProps as InputNumberSpinnerProps } from "./NumberSpinner";
export type { InputProps as InputSelectProps } from "./Select";
export type { InputProps as InputTextBoxProps } from "./Textbox";

export interface BaseInputProps {
  type: LAYOUT_INPUT_TYPE;
  label: string;

  disabled?: boolean;
  value?: any;
  focus?: boolean;
  validationError?: string;

  // Events
  onChange: Function;
  onValidate: Function;
  onFocus: Function;
  onBlur: Function;
}

export const DefaultInputProps = {
  onChange: () => {},
  onValidate: () => {},
  onFocus: () => {},
  onBlur: () => {},

  validationError: "",
  focus: false,
  disabled: false,
};

export enum LAYOUT_INPUT_TYPE {
  Asset = "ASSET",
  Checkbox = "CHECKBOX",
  NumberSpinner = "NUMBER_SPINNER",
  Select = "SELECT",
  Textbox = "TEXTBOX",
}
