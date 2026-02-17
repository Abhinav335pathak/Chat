import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

export default function SwipeWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // const routes = ["/", "/status"];

  // const currentIndex = routes.indexOf("/");

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // if (currentIndex < routes.length - 1) {
      //   navigate(routes[currentIndex - 1]);
      // }
      navigate("/status");
    },
    // ,
    // onSwipedRight: () => {
    //   if (currentIndex > 0) {
    //     navigate(routes[currentIndex + 1]);
    //   }
    // },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  return (
    <div {...handlers} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
