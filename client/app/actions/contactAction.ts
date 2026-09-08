"use server";
import { revalidatePath } from "next/cache";
import { ContactActionState } from "../types/types";
export async function contactAction(
  prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phone-number") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const recaptchaToken = formData.get("g-recaptcha-response") as string;

  if (!recaptchaToken) {
    const errors: Record<string, string> = {};
    errors["recaptcha"] = "Vă rugăm să completați recaptcha.";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați recaptcha.",
    };
  }

  if (!name || !name.trim()) {
    const errors: Record<string, string> = {};
    errors["name"] = "Numele este obligatoriu";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați toate câmpurile obligatorii.",
    };
  }
  if (!phoneNumber || !phoneNumber.trim()) {
    const errors: Record<string, string> = {};
    errors["phone"] = "Numărul de telefon este obligatoriu";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați toate câmpurile obligatorii.",
    };
  }
  const phoneRegex = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
  if (!phoneRegex.test(phoneNumber)) {
    const errors: Record<string, string> = {};
    errors["phone"] = "Numărul de telefon este invalid";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați un număr de telefon valid.",
    };
  }
  if (!email || !email.trim()) {
    const errors: Record<string, string> = {};
    errors["email"] = "Emailul este obligatoriu";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați toate câmpurile obligatorii.",
    };
  }
  if (!subject || !subject.trim()) {
    const errors: Record<string, string> = {};
    errors["subject"] = "Subiectul este obligatoriu";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să alegeți un subiect.",
    };
  }
  if (!message || !message.trim()) {
    const errors: Record<string, string> = {};
    errors["message"] = "Mesajul este obligatoriu";
    return {
      success: false,
      errors,
      formError: "Vă rugăm să completați toate câmpurile obligatorii.",
    };
  }
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  try {
    const response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phoneNumber,
        email,
        subject,
        message,
        recaptchaToken,
      }),
    });

    console.log(response);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (errorData.validationErrors) {
        return {
          success: false,
          errors: errorData.validationErrors,
          formError: "Verificați câmpurile marcate și încercați din nou.",
        };
      }

      return {
        success: false,
        errors: {},
        formError:
          errorData.error ||
          errorData.message ||
          "A apărut o eroare la salvare.",
      };
    }
    revalidatePath("/");
    return {
      success: true,
      message: "Mesajul a fost trimis cu succes.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      formError:
        "A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou.",
    };
  }
}
