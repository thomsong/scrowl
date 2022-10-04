import Textbox from "./Textbox";
import Checkbox from "./Checkbox";
import RangeSlider from "./RangeSlider";
import Select from "./Select";
import ColorPicker from "./ColorPicker";
import CheckboxText from "./CheckboxText";
import NumberSpinner from "./NumberSpinner";

import ImageAsset from "./ImageAsset";
import { LAYOUT_INPUT_TYPE } from "./Types";

function InputFactory(type: LAYOUT_INPUT_TYPE): any {
  switch (type) {
    case LAYOUT_INPUT_TYPE.Textbox:
      return Textbox;
    case LAYOUT_INPUT_TYPE.Asset:
      return ImageAsset;
    case LAYOUT_INPUT_TYPE.Checkbox:
      return Checkbox;
    case LAYOUT_INPUT_TYPE.RangeSlider:
      return RangeSlider;
    case LAYOUT_INPUT_TYPE.Select:
      return Select;
    case LAYOUT_INPUT_TYPE.ColorPicker:
      return ColorPicker;
    case LAYOUT_INPUT_TYPE.CheckboxText:
      return CheckboxText;
    case LAYOUT_INPUT_TYPE.NumberSpinner:
      return NumberSpinner;

    default:
      console.error("Invalid Input Type: " + type);
      return Textbox;
  }
}

export default InputFactory;
