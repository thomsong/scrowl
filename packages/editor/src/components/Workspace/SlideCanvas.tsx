import { motion } from "framer-motion";

import { useAppSelector } from "../../store/hooks";
import { RATIO_SIZE } from "./../../store/slices/ui";

import SlideRenderer from "../SlideRenderer";

const SlideCanvas = () => {
  const workspaceRatioSize: any = useAppSelector((state) => state["ui"].workspaceRatioSize);

  return (
    <motion.div
      className={
        "scrowl-canvas " + (workspaceRatioSize === RATIO_SIZE.Wide_16_9 ? "ratio ratio-16x9" : "")
      }
    >
      <SlideRenderer />
    </motion.div>
  );
};

export default SlideCanvas;
