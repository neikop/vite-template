import { Bridge } from "views/Bridge"
import { Guide } from "views/Component"
import { Home } from "views/Home"
import { Transfer } from "views/Transfer"

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
  transfer: {
    component: Transfer,
    name: "Transfer",
    path: "/transfer",
  },
}

export default privateRoute
