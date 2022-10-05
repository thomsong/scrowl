import {
  BaseInputProps,
  InputFieldsetProps,
} from "editor/src/components/RightPanel/ContentTab/inputs/Types";
export * from "editor/src/components/RightPanel/ContentTab/inputs/Types";

export interface TemplateLayout {
  state: any;
  schema: { [key: string]: BaseInputProps | InputFieldsetProps };
}
