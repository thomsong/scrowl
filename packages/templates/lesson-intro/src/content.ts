import { LAYOUT_INPUT_TYPE, MIGRATION_HINT } from "embed-host";

export function getLayout(payload: any): any {
  return {
    state: {},
    schema: {
      title: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        hint: MIGRATION_HINT.Header,
        label: "Title",
        placeholder: "Title",
      },
      subtitle: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        hint: MIGRATION_HINT.SubHeader,
        label: "Subtitle",
        placeholder: "Subtitle",
      },
      time: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        hint: MIGRATION_HINT.Time,
        label: "Time",
        placeholder: "How long will it take?",
      },

      start_label: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Start Label",
        placeholder: "Start",
      },

      hero_image: {
        type: "FIELDSET",
        label: "Hero Image",
        fields: {
          alt: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Alt Text",
            placeholder: "Image alt text",
          },
          url: {
            type: LAYOUT_INPUT_TYPE.Asset,
            assetType: "image",
            label: "Image",
          },
        },
      },
    },
  };
}

export function validate(payload: any) {
  const slideContent = payload.slide.content;
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
