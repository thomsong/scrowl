import { useLottie } from "lottie-react";
import animationData from "./lottie/hand-drawn-arrow/data.json";

const LottieAnimation = (props: any) => {
  const options = {
    animationData,
    loop: props.loop === false ? false : true,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};

const DrawnArrow = (props: any) => {
  let config = props.config ? props.config : { rotateDeg: 0, scaleX: 1, scaleY: 1 };

  switch (props.direction) {
    case "left":
      config = { rotateDeg: 90, scaleX: -1, scaleY: 1 };
      break;
    case "right":
      config = { rotateDeg: 90, scaleX: -1, scaleY: -1 };
      break;
    case "up":
      config = { rotateDeg: 0, scaleX: -1, scaleY: -1 };
      break;
    case "down":
      // Initial config
      break;
  }

  let transform = "";
  if (config.rotateDeg !== 0) {
    transform += "rotate(" + config.rotateDeg + "deg)";
  }

  if (config.scaleX !== 0) {
    transform += "scaleX(" + config.scaleX + ")";
  }

  if (config.scaleY !== 0) {
    transform += "scaleY(" + config.scaleY + ")";
  }

  const style = {
    ...props.style,
    transform,
  };
  return (
    <div style={style}>
      <LottieAnimation {...props} />
    </div>
  );
};

export default DrawnArrow;
