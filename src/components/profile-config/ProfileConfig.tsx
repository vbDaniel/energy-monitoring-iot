import { useState, MouseEvent } from "react";
import { Button } from "@/components/buttons";

import { Logout, ChevronDown } from "src/assets";

import styles from "./ProfileConfig.module.css";

import { useAuth } from "src/context/auth";
import { MenuModal } from "../modals";

export default function ProfileConfig() {
  const { user, signOut } = useAuth();
  const [openLogout, setOpenLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickLogout = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenLogout(!openLogout);
  };

  const handleActionClick = () => {
    signOut();
  };

  return (
    <div className={styles.headerContainer}>
      <MenuModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
        anchorEl={anchorEl}
        handleActionClick={handleActionClick}
        header={
          <Button
            id="profile-button"
            aria-controls={openLogout ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openLogout ? "true" : undefined}
            onClick={handleClickLogout}
            style={{ width: "fit-content" }}
            classStyle={styles.profileButton}
            data-testid="profile-button"
          >
            <div className={styles.profileIcon}>
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user?.image} alt={"Foto de Perfil"} />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <span>{user?.name}</span>
              <ChevronDown />;
            </div>
          </Button>
        }
      >
        <div className={styles.logoutButton}>
          <span>Sair </span>
          <Logout />
        </div>
      </MenuModal>
    </div>
  );
}
