import { MessageSquare } from "lucide-react";
import { ContactMessage } from "@/app/types/types";
import { ContactCard } from "./ContactCard";
import "@/app/styles/contact.css";

interface ContactMessagesGridProps {
  contacts: ContactMessage[];
}

export const ContactMessagesGrid = ({ contacts }: ContactMessagesGridProps) => {
  if (contacts.length === 0) {
    return (
      <div className="contact-messages-empty" role="status" aria-live="polite">
        <span className="contact-messages-empty__icon" aria-hidden="true">
          <MessageSquare size={28} />
        </span>
        <h2>Nu există mesaje de contact</h2>
        <p>Mesajele primite prin formularul de contact vor apărea aici.</p>
      </div>
    );
  }

  return (
    <div className="contact-messages-grid">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
};
