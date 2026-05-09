import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ResponseType } from "../lib/actions";

export const useCreateModalState = (action: (state: ResponseType, formData: FormData) => Promise<any>) => {
  const [state, formAction, isPending] = useActionState(action, { message: "", status: "" });

  useEffect(() => {
    if (!state.message) return;
    state.status === "error"
      ? toast.error(state.message)
      : toast.success(state.message, { description: state?.description });
  }, [state]);

  return { formAction, isPending };
};
