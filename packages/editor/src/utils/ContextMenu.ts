export enum TARGET_ALIGNMENT {
  LeftTop = "left-top",
  LeftCenter = "left-center",
  LeftBottom = "left-bottom",

  CenterTop = "center-top",
  CenterCenter = "center-center",
  CenterBottom = "center-bottom",

  RightTop = "right-top",
  RightCenter = "right-center",
  RightBottom = "right-bottom",
}

const getTargetPosition = (target: any, alignment?: TARGET_ALIGNMENT) => {
  if (!target) {
    return null;
  }

  let position: Array<number> | null = null;
  if (!alignment || !alignment.includes("-")) {
    alignment = TARGET_ALIGNMENT.CenterCenter;
  }

  let alignmentParts: any = alignment.split("-");
  if (alignmentParts.length !== 2) {
    alignmentParts = TARGET_ALIGNMENT.CenterCenter.split("-");
  }

  const targetBounds = target.getBoundingClientRect();
  position = [];

  // x
  switch (alignmentParts[0]) {
    case "left":
      position[0] = targetBounds.left;
      break;
    case "right":
      position[0] = targetBounds.right;
      break;
    default: // center
      position[0] = (targetBounds.left + targetBounds.right) / 2;
  }

  // y
  switch (alignmentParts[1]) {
    case "top":
      position[1] = targetBounds.top;
      break;
    case "bottom":
      position[1] = targetBounds.bottom;
      break;
    default: // center
      position[1] = (targetBounds.top + targetBounds.bottom) / 2;
  }

  position[0] = Math.round(position[0]);
  position[1] = Math.round(position[1]);

  return position;
};

const show = async (options: any, target?, alignment?: TARGET_ALIGNMENT, posOffset?) => {
  let position = getTargetPosition(target, alignment);

  let optionIndex = 0;
  const menuButtons = options.map((option) => {
    const btn = { ...option };
    delete btn.onClick;

    btn.id = optionIndex;

    optionIndex++;
    return btn;
  });

  if (posOffset && position) {
    position[0] += posOffset[0];
    position[1] += posOffset[1];
  }
  const result = await (window as any).ScrowlApp.showContextMenu(menuButtons, position);

  if (result) {
    const callback = options[result.id].onClick;
    if (callback) {
      callback();
      return;
    }
  } else {
    // Menu was closed
  }
};

const ContextMenu = {
  show,
};

export default ContextMenu;
