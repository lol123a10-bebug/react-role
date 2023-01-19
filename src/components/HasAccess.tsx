import * as React from "react";
import { useEffect, useState } from "react";
import { TUserRoleTuple } from "../utils/models/user";

const LOCAL_STORAGE_KEY_USER = "__permifyUser";

export interface HasAccessProps {
  roles?: TUserRoleTuple[];
  permissions?: TUserRoleTuple[];
  isLoading?: React.ReactElement;
  renderAuthFailed?: React.ReactElement;
  children: React.ReactChild;
}

const getUserRole = (role: TUserRoleTuple) => (isNaN(+role) ? role : +role);

const HasAccess: React.FunctionComponent<HasAccessProps> = ({
  roles,
  permissions,
  isLoading,
  renderAuthFailed,
  children,
}) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER));

    if (!storedUser) {
      console.log("No user provided to Permify! You should set user to perfom access check");
      return;
    }

    setChecking(true);

    // role check
    if (roles && storedUser.roles && storedUser.roles.length > 0) {
      const intersection = storedUser.roles.filter((role: string) => roles.includes(getUserRole(role)));
      if (intersection.length > 0) setHasAccess(true);
    }

    // permission check
    if (permissions && storedUser.permissions && storedUser.permissions.length > 0) {
      const intersection = storedUser.permissions.filter((permission: string) =>
        permissions.includes(getUserRole(permission))
      );
      if (intersection.length > 0) setHasAccess(true);
    }

    setChecking(false);
  }, [roles, permissions]);

  if (!hasAccess && checking) {
    return isLoading;
  }

  if (hasAccess) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (renderAuthFailed) {
    return renderAuthFailed;
  }

  return null;
};

export default HasAccess;
