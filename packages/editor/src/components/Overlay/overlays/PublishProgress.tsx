import RocketAnimation from "../../../components/animations/Rocket";

import OverlayModal from "../OverlayModal";

function PublishProgress(props: any) {
  //   const id = useId();

  //   const dispatch = useAppDispatch();

  console.log("props", props.data.canClose);
  return (
    <OverlayModal
      {...props}
      canClose={props.data.canClose}
      minimalUI={true}
      size="sm"
      className="publish-progress-modal"
    >
      <h5 className="mt-4">Publishing Course...</h5>
      <div style={{ margin: "-40px auto auto auto", width: "200px", transform: "rotate(45deg)" }}>
        <RocketAnimation />
      </div>
    </OverlayModal>
  );
}

export default PublishProgress;
