import React, { useCallback, useState } from "react";

//context
import PermifyContext from "./PermifyContext";
import { TUserRoleTuple, UserPayload } from "./utils/models/user";

const LOCAL_STORAGE_KEY_USER = "__permifyUser";

interface Props {
  children: React.ReactNode;
}

const PermifyProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateUser = (newUser: UserPayload) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newUser));
  };

  const isAuthorized = useCallback(
    async (roleNames: TUserRoleTuple[], permissionNames?: TUserRoleTuple[]): Promise<boolean> => {
      let hasAuthorization: boolean = false;
      const storedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER));

      setIsLoading(true);
      if (storedUser) {
        hasAuthorization = await CheckUserHasRolesOrPermissions(storedUser, roleNames, permissionNames);
      }
      setIsLoading(false);

      return hasAuthorization;
    },
    []
  );

  const CheckUserHasRolesOrPermissions = async (
    storedUser: UserPayload,
    roleNames?: TUserRoleTuple[],
    permissionNames?: TUserRoleTuple[]
  ): Promise<boolean> => {
    let hasRoles: boolean = false;
    let hasPermissions: boolean = false;

    // role checking
    if (storedUser.roles && roleNames && storedUser.roles.length > 0) {
      const userRoles = storedUser.roles;

      const intersection = userRoles.filter((role) => roleNames.includes(role));
      hasRoles = intersection.length > 0;
    }

    // permission checking
    if (storedUser.permissions && permissionNames && storedUser.permissions.length > 0) {
      const userPermissions = storedUser.permissions;

      const intersection = userPermissions.filter((permission) => permissionNames.includes(permission));
      hasPermissions = intersection.length > 0;
    }

    return hasRoles || hasPermissions;
  };

  return (
    <PermifyContext.Provider
      value={{
        setUser: updateUser,
        isAuthorized,
        isLoading,
      }}
    >
      {children}
    </PermifyContext.Provider>
  );
};

export default PermifyProvider;
