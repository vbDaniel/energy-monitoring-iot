import { Menu, MenuItem } from "@mui/material"

import { ToggleProps } from "./MenuModal.types"

export default function MenuModal({
    open,
    disabledMenuItem,
    disabledMenuItemHouver,
    handleClose,
    handleActionClick,
    anchorEl,
    header,
    children,
    anchorOrigin = {
        vertical: "bottom",
        horizontal: "right",
    },
    transformOrigin = {
        vertical: "bottom",
        horizontal: "right",
    },
    margin = "52px 0px 0px 0px",
}: ToggleProps) {
    return (
        <div>
            {header}
            <Menu
                id="basic-menu"
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        margin: margin,
                        borderRadius: "8px",
                        boxShadow: "0px 4px 8px 4px rgba(0,0,0,0.1)",
                    },
                }}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            >
                <MenuItem
                    disabled={disabledMenuItem}
                    onClick={handleActionClick}
                    sx={{
                        "&:hover": disabledMenuItemHouver
                            ? {
                                  backgroundColor: "transparent",
                                  cursor: "default",
                                  opacity: 1,
                              }
                            : {},
                        padding: 0,
                    }}
                    disableRipple={disabledMenuItemHouver}
                >
                    {children}
                </MenuItem>
            </Menu>
        </div>
    )
}
