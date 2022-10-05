import {
  LAYOUT_INPUT_TYPE,
  MIGRATION_HINT,
  TemplateLayout,
  InputFieldsetProps,
  InputTextBoxProps,
  InputSelectProps,
  InputAssetProps,
  InputCheckboxProps,
} from "embed-host";

export function getLayout(payload: any): TemplateLayout {
  const content = payload.content;

  return {
    state: {},
    schema: {
      text: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        hint: MIGRATION_HINT.BodyText,
        label: "Block Text",
        placeholder: "Write content here...",
        multiLine: true,
        lines: 10,
        autoGrow: 10,
        allowLinebreaks: true,
      } as InputTextBoxProps,

      bgImage: {
        type: LAYOUT_INPUT_TYPE.Fieldset,
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
          bg: {
            type: LAYOUT_INPUT_TYPE.Checkbox,
            label: "Use As Background",
          } as InputCheckboxProps,
        },
      },

      options: {
        type: LAYOUT_INPUT_TYPE.Fieldset,
        label: "Options",
        fields: {
          alignment: {
            type: LAYOUT_INPUT_TYPE.Select,
            hint: MIGRATION_HINT.BodyAlignment,
            label: "Alignment",
            default: "left",
            options: [
              { name: "Align Left", value: "left" },
              { name: "Align Right", value: "right" },
            ],

            pre: {
              width: 26,
              items: [
                {
                  type: "icon",
                  name:
                    content.alignment === "right"
                      ? "align_horizontal_right"
                      : "align_horizontal_left",
                },
              ],
            },
          } as InputSelectProps,

          showProgress: {
            type: LAYOUT_INPUT_TYPE.Checkbox,
            label: "Show Progress Bar",
          } as InputCheckboxProps,
        },
      } as InputFieldsetProps,
    },
  } as TemplateLayout;
}

export function validate(payload: any) {
  const slideContent = (payload.slide && payload.slide.content) || {};
  const result: any = {};

  if (slideContent["hero_image.url"] && !slideContent["hero_image.alt"]) {
    result["hero_image.alt"] = { error: "Alt text is required for all images" };
  }

  return result;
}

// TODO: Introduce the concept of migrating content
// This can be from a previous template version to a newer version
// This can also be from a non-related template to this template using hints
// or custom logic
export function migrate(payload: any) {
  return payload;
}
