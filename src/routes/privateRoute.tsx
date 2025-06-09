import { Bridge } from "views/Bridge"
import { Guide } from "views/Component"
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
    component: Bridge,
    name: "Bridge",
    path: "/bridge",
  },
  transfer: {
    component: Transfer,
    name: "Transfer",
    path: "/transfer",
  },
}

export default privateRoute
