import { LAYOUT_INPUT_TYPE } from "embed-host";

export function getLayout(payload: any): any {
  return {
    state: {},
    schema: {
      address: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Address",
        placeholder: "Enter your address",
        multiLine: true,
        lines: 5,
        autoGrow: 5,
        allowLinebreaks: true,
        maxLength: 2500,
      },
    },
  };
}

export function validate(payload: any) {
  // const slideContent = payload.slide.content;
  const result: any = {};

  return result;
}

// TODO: Introduce the concept of migrating content
// This can be from a previous template version to a newer version
// This can also be from a non-related template to this template using hints
// or custom logic
export function migrate(payload: any) {
  return payload;
}
