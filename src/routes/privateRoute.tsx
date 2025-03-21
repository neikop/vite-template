import { Home } from "views/Home"
import { Hotel } from "views/Hotel"

const privateRoute = {
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
