export interface UserPayload {
  id: TUserRoleTuple;
  roles?: TUserRoleTuple[];
  permissions?: TUserRoleTuple[];
}

export type TUserRoleTuple = string | number;
