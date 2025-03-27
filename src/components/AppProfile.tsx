import { Logout, PasswordOutlined, PersonOutline } from "@mui/icons-material"
import { Avatar, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material"
import { Flex } from "components/common"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import { useToggle } from "react-use"
import { profileSelector, signOut } from "reducers/profileSlice"
import { authRoute, privateRoute } from "routes"
import { ProfileChangePasswordDialog } from "views/Profile"

const AppProfile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(profileSelector)

  const [anchorMenu, setAnchorMenu] = useState<HTMLButtonElement | null>(null)
  const [isOpen, onToggle] = useToggle(false)

  const handleLogout = () => {
    enqueueSnackbar("Đăng xuất thành công")
    dispatch(signOut())
    navigate(authRoute.login.url)
  }

  return (
    <Flex className="items-center justify-end gap-2">
      <Button className="rounded-full p-1 pr-3" onClick={(event) => setAnchorMenu(event.currentTarget)} size="small">
        <Avatar className="bg-primary-main mr-2 h-7 w-7">{user?.username?.[0].toUpperCase()}</Avatar>
        {user?.username}
      </Button>

      <Menu
        anchorEl={anchorMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={() => setAnchorMenu(null)}
        open={!!anchorMenu}
        slotProps={{
          paper: {
            onClick: () => setAnchorMenu(null),
            sx: { marginTop: 1, width: 240 },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Link to={privateRoute.profile.path}>
          <MenuItem>
            <ListItemIcon>
              <PersonOutline fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tài khoản</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem onClick={() => onToggle(true)}>
          <ListItemIcon>
            <PasswordOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Đổi mật khẩu</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
          <Typography color="textSecondary" variant="body2">
            ⌘W
          </Typography>
        </MenuItem>
      </Menu>

      <ProfileChangePasswordDialog onClose={() => onToggle(false)} open={isOpen} />
    </Flex>
  )
}

export default AppProfile
