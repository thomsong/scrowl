import {
  LAYOUT_INPUT_TYPE,
  TemplateLayout,
  InputTextBoxProps,
  InputSelectProps,
  InputAssetProps,
} from "embed-host";

export function getLayout(payload: any): TemplateLayout {
  return {
    state: {},
    schema: {
      body: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Text",
        placeholder: "Enter your text",
        multiLine: true,
        lines: 10,
        autoGrow: 10,
        allowLinebreaks: true,
        maxLength: 2500,
      } as InputTextBoxProps,

      alignment: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Text Alignment",
        options: [
          { name: "Full Justify", value: "justify", default: true },
          { name: "Align Left", value: "left" },
          { name: "Align Center", value: "center" },
          { name: "Align Right", value: "right" },
        ],
      } as InputSelectProps,

      animateLists: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Animations",
        options: [
          { name: "No Animation", value: "", default: true },
          // { name: "Animate Lists", value: "lists" },
          // { name: "Animate Paragraphs", value: "paragraphs" },
          { name: "Lists & Paragraphs", value: "all" },
        ],
      } as InputSelectProps,

      bgImage: {
        type: "FIELDSET",
        label: "Background Image",
        fields: {
          alt: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Alt Text",
            placeholder: "Image alt text",
          } as InputTextBoxProps,
          url: {
            type: LAYOUT_INPUT_TYPE.Asset,
            assetType: "image",
            label: "Image",
          } as InputAssetProps,
        },
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
