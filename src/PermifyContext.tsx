import { createContext } from "react";
import { UserPayload } from "./utils/models/user";

export interface PermifyAuthContext {
  setUser: (user: UserPayload) => void;
  isAuthorized: (roleNames?: (string | number)[], permissionsNames?: (string | number)[]) => Promise<boolean>;
  isLoading: boolean;
}

const noUser = (): never => {
  throw new Error("You didn't set User!");
};

const PermifyContext = createContext<PermifyAuthContext>({
  setUser: noUser,
  isAuthorized: noUser,
  isLoading: false,
});

export default PermifyContext;
