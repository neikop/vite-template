import { Bridge } from "views/Bridge"
import { Home } from "views/Home"

const privateRoute = {
  bridge: {
    component: Bridge,
    name: "Bridge",
    path: "/bridge",
  },
  home: {
    component: Home,
    name: "Home",
    path: "/",
  },
}

export default privateRoute
