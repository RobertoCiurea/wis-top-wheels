import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getContactMessages } from "@/services/contactMessagesService";
import { ContactMessagesGrid } from "@/app/components/ContactMessages";
import "@/app/styles/contact.css";
export default async function MessagesDashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/messages");
  }
  const accessToken = session.accessToken as string;
  const messages = await getContactMessages(accessToken);
  return (
    <section className="contact-messages-page" aria-labelledby="messages-title">
      <div className="eyebrow">Administrare</div>
      <h1 className="display d3" id="messages-title">
        Mesaje de <span className="accent">contact</span>
      </h1>
      <p className="contact-messages-page__intro">
        Mesajele trimise de vizitatorii site-ului.
      </p>
      <ContactMessagesGrid contacts={messages} />
    </section>
  );
}
