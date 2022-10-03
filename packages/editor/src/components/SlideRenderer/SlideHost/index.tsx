import { useEffect, useRef } from "react";
import ClientProxy from "./ClientProxy";
import { useAppSelector } from "../../../store/hooks";

function SlideHost() {
  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const lastSelectedSlide: any = useRef(null);

  const iFrameRef: any = useRef();

  useEffect(() => {
    if (!selectedSlide && !lastSelectedSlide.current) {
      return;
    } else if (
      selectedSlide &&
      lastSelectedSlide.current &&
      selectedSlide.id === lastSelectedSlide.current.id
    ) {
      return;
    }

    lastSelectedSlide.current = selectedSlide;

    (async () => {
      await ClientProxy.waitUntilConnected();

      window.scrollTo(0, 0);

      if (selectedSlide) {
        await ClientProxy.sendMessage("template.setSlide", selectedSlide);
      }
    })();
  }, [selectedSlide]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            margin:0;
            padding:0;
            
            width:100vw;
            min-height:100vh;

            overflow-x:hidden;
            overflow-y:auto;
          }

          .sld-host.empty {
            height: 100vh;
          }
          
        </style>        
        <link href="./assets/themes/default@1.0/style.css" rel="stylesheet">
        
        <script src="./player/static/js/ScrollMagic.js"></script>
        <script src="./player/static/js/anime.min.js"></script>
        <script src="./player/static/js/lottie.min.js"></script>
        <script src="./player/static/js/debug.addIndicators.js"></script>
        <script src="./player/static/js/require.js"></script>

      </head>
      <body> 
        <div id="root"></div>
        <script src="./js/embed-host.js"></script>  
      </body>
    </html>
  `;

  // scroll-slide-template
  return (
    <iframe
      ref={iFrameRef}
      className="slide-host"
      sandbox="allow-scripts" // allow-same-origin"
      title="test title"
      srcDoc={html}
    />
  );
}

export default SlideHost;
