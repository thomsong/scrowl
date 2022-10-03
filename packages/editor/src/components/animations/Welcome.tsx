import { useLottie } from "lottie-react";
import animationData from "./lottie/handwritten-welcome/data.json";

const RawAnimation = (props: any) => {
  return (
    <>
      {
        useLottie({
          animationData,
          loop: props.loop === false ? false : true,
        }).View
      }
    </>
  );
};

const LottieAnimation = (props: any) => {
  return (
    <div {...props}>
      <RawAnimation {...props} />
    </div>
  );
};

export default LottieAnimation;
