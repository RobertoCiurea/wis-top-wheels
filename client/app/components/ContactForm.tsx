"use client";
import { useState, useActionState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ContactActionState } from "@/app/types/types";
import { contactAction } from "@/app/actions/contactAction";
import { toast } from "sonner";
export const ContactForm = () => {
  const siteKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY as string;
  const [token, setToken] = useState<string | null>(null);
  const initialState: ContactActionState = {
    success: false,
    message: "",
    errors: {},
    formError: "",
  };
  const [state, formAction, isPending] = useActionState(
    contactAction,
    initialState,
  );

  const onChange = (value: string | null) => {
    setToken(value || null);
  };

  useEffect(() => {
    if (state.success) {
      toast.success("Mesajul a fost trimis cu succes!");
    } else {
      if (
        state.formError ||
        (state.errors && Object.keys(state.errors).length > 0)
      ) {
        toast.error(
          state.formError || "A apărut o eroare la trimiterea mesajului.",
        );
      }
    }
  }, [state]);

  return (
    <form className="contact-form reveal visible" action={formAction}>
      <input type="hidden" name="g-recaptcha-response" value={token || ""} />
      {state.formError && (
        <div className="form-error global-error">{state.formError}</div>
      )}
      {state.success && (
        <div className="form-success global-success">{state.message}</div>
      )}
      <h3 className="display d4" style={{ marginBottom: 24 }}>
        Trimite un mesaj
      </h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nume</label>
          {state.errors?.name && (
            <div className="form-error">{state.errors?.name}</div>
          )}
          <input
            type="text"
            name="name"
            className={`form-input ${state.errors?.name ? "form-input-error" : ""}`}
            placeholder="Ion Popescu"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Telefon</label>
          {state.errors?.phone && (
            <div className="form-error">{state.errors?.phone}</div>
          )}
          <input
            type="tel"
            name="phone-number"
            className={`form-input ${state.errors?.phone ? "form-input-error" : ""}`}
            placeholder="+40 7XX XXX XXX"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        {state.errors?.email && (
          <div className="form-error">{state.errors?.email}</div>
        )}
        <input
          type="email"
          name="email"
          className={`form-input ${state.errors?.email ? "form-input-error" : ""}`}
          placeholder="ion.popescu@example.com"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Subiect</label>
        {state.errors?.subject && (
          <div className="form-error">{state.errors?.subject}</div>
        )}
        <select
          name="subject"
          className={`form-input ${state.errors?.subject ? "form-input-error" : ""}`}
        >
          <option value="">Alege un subiect...</option>
          <option value="wheels">Jante & Anvelope</option>
          <option value="cars">Mașini de vânzare</option>
          <option value="wheels-service">Programare vulcanizare</option>
          <option value="any">Altceva</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Mesaj</label>
        {state.errors?.message && (
          <div className="form-error">{state.errors?.message}</div>
        )}
        <textarea
          name="message"
          className={`form-input ${state.errors?.message ? "form-input-error" : ""}`}
          rows={4}
          placeholder="Descrie ce cauți, ce dimensiune de jante ai, când vrei să te programezi..."
        ></textarea>
      </div>
      <ReCAPTCHA sitekey={siteKey!} onChange={onChange} />
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="submit"
          className="btn btn-gold"
          style={{ flex: "1", justifyContent: "center" }}
        >
          {isPending ? "Se trimite..." : " Trimite mesajul"}
        </button>
        <a
          href="https://wa.me/40726547517"
          className="btn btn-ghost"
          style={{ flex: "1", justifyContent: "center" }}
        >
          💬 WhatsApp direct
        </a>
      </div>
    </form>
  );
};
