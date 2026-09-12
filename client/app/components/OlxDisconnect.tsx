"use client";
import { LogOut } from "lucide-react";
import { useActionState, useEffect } from "react";
import { disconnectFromOlx } from "../actions/disconnectOlx";
import { ActionState } from "../types/types";
import { toast } from "sonner";

export const OlxDisconnect = () => {
  const initialState: ActionState = {
    status: 0,
    message: "",
    error: "",
  };
  const [state, formAction, isPending] = useActionState(
    disconnectFromOlx,
    initialState,
  );

  useEffect(() => {
    if (state.status === 0) return;
    if (state.status !== 200) {
      toast.error(
        state.error || state.message || "Deconectarea de la OLX a eșuat.",
      );
    } else {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <form action={formAction} className="olx-connect__disconnect-form">
      <button
        type="submit"
        className="btn btn-ghost olx-connect__disconnect-button"
        disabled={isPending}
      >
        <LogOut size={16} aria-hidden="true" />
        {isPending ? "Deconectare..." : "Deconectează contul OLX"}
      </button>
    </form>
  );
};
