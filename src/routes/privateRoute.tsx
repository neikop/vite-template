import { Bridge } from "views/Bridge"
import { Guide } from "views/Component"
import { MultiSign } from "views/MultiSign"
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
  multiSign: {
    component: MultiSign,
    name: "Multi Sign",
    path: "/multi-sign",
  },
  transfer: {
    component: Transfer,
    name: "Transfer",
    path: "/transfer",
  },
}

export default privateRoute
