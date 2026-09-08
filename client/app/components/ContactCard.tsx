"use client";
import { useActionState, useEffect } from "react";
import { deleteMessageAction } from "@/app/actions/deleteMessageAction";
import { Mail, MessageSquare, Phone, User, Trash } from "lucide-react";
import {
  ContactMessage,
  getSubjectLabel,
  ActionState,
} from "@/app/types/types";
import { toast } from "sonner";
import "@/app/styles/contact.css";

interface ContactCardProps {
  contact: ContactMessage;
}

const initialState: ActionState = {
  status: 0,
  message: "",
  error: "",
};

export const ContactCard = ({ contact }: ContactCardProps) => {
  const [state, formAction, isPedning] = useActionState(
    deleteMessageAction,
    initialState,
  );

  useEffect(() => {
    if (state.status !== 0) {
      if (state.status === 200) {
        toast.success(state.message || "Mesajul a fost șters cu succes!");
      } else {
        toast.error(state.error || "A apărut o eroare la ștergerea mesajului!");
      }
    }
  }, [state]);
  return (
    <article className="contact-message-card">
      <header className="contact-message-card__header">
        <div className="contact-message-card__identity">
          <span className="contact-message-card__avatar" aria-hidden="true">
            <User size={20} />
          </span>
          <div>
            <h2 className="contact-message-card__name">{contact.name}</h2>
            <p className="contact-message-card__meta">Mesaj #{contact.id}</p>
          </div>
        </div>
        <span className="contact-message-card__subject">
          {getSubjectLabel(contact.subject)}
        </span>
      </header>

      <div className="contact-message-card__info">
        <a
          className="contact-message-card__link"
          href={`mailto:${contact.email}`}
          title={`Trimite email către ${contact.email}`}
        >
          <Mail size={17} aria-hidden="true" />
          <span>{contact.email}</span>
        </a>
        <a
          className="contact-message-card__link"
          href={`tel:${contact.phoneNumber}`}
          title={`Apelează ${contact.phoneNumber}`}
        >
          <Phone size={17} aria-hidden="true" />
          <span>{contact.phoneNumber}</span>
        </a>
      </div>

      <div className="contact-message-card__message">
        <div className="contact-message-card__section-label">
          <MessageSquare size={16} aria-hidden="true" />
          <span>Mesaj</span>
        </div>
        <p>{contact.message}</p>
      </div>
      <div className="contact-message-card__actions">
        <form action={formAction}>
          <input type="hidden" name="contact-id" value={contact.id} />
          <button
            type="submit"
            className="btn delete-button"
            disabled={isPedning}
          >
            <Trash />
            {isPedning ? "Ștergere..." : "Șterge mesajul"}
          </button>
        </form>
      </div>
    </article>
  );
};
