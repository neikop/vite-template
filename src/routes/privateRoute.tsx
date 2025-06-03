import { Dynamic } from "views/Dynamic"
import { Home } from "views/Home"
import { Hotel } from "views/Hotel"

const privateRoute = {
  brownfi: {
    component: Dynamic,
    name: "BrownFi",
    path: "/brownfi",
  },
  home: {
    component: Home,
    name: "Home",
    path: "/",
  },
  hotel: {
    component: Hotel,
    name: "Hotel",
    path: "/hotel",
  },
}

export default privateRoute
