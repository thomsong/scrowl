import TrophyAnimation from "../../../components/animations/Trophy";
import ConfettiAnimation from "../../../components/animations/Confetti";

import OverlayModal from "../OverlayModal";

function FirstPublish(props: any) {
  //   const id = useId();

  //   const dispatch = useAppDispatch();

  return (
    <OverlayModal
      {...props}
      buttons={{ cancel: "Close", submit: false }}
      //   minimalUI={true}
      title="Publish Course"
      size="md"
      className="first-publish-modal"
    >
      <h4 className="mt-4">🌟 Congratulations 🌟</h4>
      <h5 className="mt-4">You Published Your First Course</h5>

      <div style={{ position: "absolute", top: "0", left: "0" }}>
        <ConfettiAnimation loop={true} />
      </div>

      <div style={{ margin: "-80px auto -100px auto", width: "400px" }}>
        <TrophyAnimation loop={false} />
      </div>
    </OverlayModal>
  );
}

export default FirstPublish;
