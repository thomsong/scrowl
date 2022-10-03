import { LAYOUT_INPUT_TYPE } from "embed-host";

export function getLayout(payload: any): any {
  return {
    state: {},
    schema: {
      lottie: {
        type: LAYOUT_INPUT_TYPE.Asset,
        assetType: "lottie",
        label: "Lottie Animation",
      },

      duration: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Duration",
        placeholder: "Animation time",
      },

      alignment: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Alignment",
        options: [
          { name: "Top Left", value: "top left" },
          { name: "Top", value: "top" },
          { name: "Top Right", value: "top right" },

          { name: "Left", value: "left" },
          { name: "Center", value: "center", default: true },
          { name: "Right", value: "right" },

          { name: "Bottom Left", value: "bottom left" },
          { name: "Bottom", value: "bottom" },
          { name: "Bottom Right", value: "bottom right" },
        ],
      },

      size: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Size",
        options: [
          { name: "Extra Small", value: "xs" },
          { name: "Small", value: "sm" },
          { name: "Medium", value: "md", default: true },
          { name: "Large", value: "lg" },
        ],
      },

      scrollOffset: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Scroll Offset",
        options: [
          { name: "No Offset", value: 1 },
          { name: "Half Offset", value: 0.5, default: true },
          { name: "Full Offset", value: 0 },
        ],
      },

      bgImage: {
        type: "FIELDSET",
        label: "Background Image",
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

  let newDuration: any = parseInt(slideContent["duration"]);

  if (newDuration < 500 || isNaN(newDuration)) {
    newDuration = 500;
  }

  if (slideContent["duration"]) {
    result["duration"] = { value: String(newDuration) };
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
