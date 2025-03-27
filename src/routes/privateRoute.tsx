import { Home } from "views/Home"
import { Profile } from "views/Profile"

const privateRoute = {
  home: {
    component: Home,
    name: "Home",
    path: "/",
    requiredPermission: "",
  },
  profile: {
    component: Profile,
    name: "Profile",
    path: "/profile",
  },
}

export default privateRoute
