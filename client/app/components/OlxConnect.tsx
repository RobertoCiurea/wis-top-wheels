"use client";
import { connectToOlx } from "../actions/connectOlx";
import { useActionState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActionState } from "../types/types";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import "../styles/olx-connect.css";

export const OlxConnect = () => {
  const initialState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };
  const [state, formAction, isPending] = useActionState(
    connectToOlx,
    initialState,
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastActionNotification = useRef("");
  const processedOAuthStatus = useRef<string | null>(null);

  useEffect(() => {
    if (state.status === 0) {
      return;
    }

    const notificationKey = `${state.status}:${state.message ?? ""}:${state.error ?? ""}`;
    if (notificationKey === lastActionNotification.current) {
      return;
    }

    lastActionNotification.current = notificationKey;
    if (state.status !== 200) {
      toast.error(state.error || state.message || "Conectarea la OLX a eșuat.");
    }
  }, [state.error, state.message, state.status]);

  useEffect(() => {
    const olxStatus = searchParams.get("olx");
    if (
      !olxStatus ||
      (olxStatus !== "success" && olxStatus !== "error") ||
      processedOAuthStatus.current === olxStatus
    ) {
      return;
    }

    processedOAuthStatus.current = olxStatus;
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("olx");
    const queryString = nextSearchParams.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });

    window.setTimeout(() => {
      if (olxStatus === "success") {
        toast.success(
          "Contul OLX a fost sincronizat cu succes în baza de date.",
        );
      } else {
        toast.error(
          "A apărut o eroare în timpul autorizării pe serverele OLX.",
        );
      }
    }, 0);
  }, [pathname, router, searchParams]);

  return (
    <section className="olx-connect" aria-labelledby="olx-connect-title">
      <div className="olx-connect__content">
        <p className="eyebrow">Integrare OLX</p>
        <h1 id="olx-connect-title" className="display d3">
          Conectează-ți contul OLX
        </h1>
        <p className="olx-connect__description">
          Conectează-ți contul OLX pentru a sincroniza și administra anunțurile
          din aplicație.
        </p>
      </div>
      <form action={formAction} className="olx-connect__form">
        <button
          type="submit"
          className="btn btn-gold btn-lg olx-connect__button"
          disabled={isPending}
          aria-busy={isPending}
        >
          <span className="olx-connect__button-content">
            {isPending ? (
              <LoaderCircle
                className="olx-connect__spinner"
                aria-hidden="true"
              />
            ) : null}
            <span>
              {isPending ? "Se conectează la OLX..." : "Conectează-te la OLX"}
            </span>
          </span>
        </button>
        {isPending ? (
          <p className="olx-connect__status" role="status" aria-live="polite">
            Se deschide pagina securizată de autorizare OLX.
          </p>
        ) : null}
      </form>
    </section>
  );
};
