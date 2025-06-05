import { Bridge } from "views/Bridge"
import { Guide } from "views/Component"
import { Home } from "views/Home"

const privateRoute = {
  bridge: {
    component: Bridge,
    name: "Bridge",
    path: "/bridge",
  },
  guide: {
    component: Guide,
    name: "Component",
    path: "/component",
  },
  home: {
    component: Home,
    name: "Home",
    path: "/",
  },
}

export default privateRoute
