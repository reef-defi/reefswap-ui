import { Notify } from "@reef-defi/react-lib";
import { toast } from "react-toastify";

export const notify = (message: string, type: Notify='success'): void => {
  toast[type](message);
};
