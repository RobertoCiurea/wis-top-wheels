"use client";
import { useState, useCallback, useActionState, useEffect } from "react";
import { Modal } from "@/app/components/Modal";
import "@/app/styles/contact.css";
import { Circle, CheckCircle2 } from "lucide-react";
import { ActionState } from "../types/types";
import { addUser } from "../actions/addUserAction";
import { toast } from "sonner";
export const AddUser = ({
  accessToken,
}: {
  accessToken: string | undefined;
}) => {
  const initialState: ActionState = {
    status: 0,
    message: "",
    error: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, formAction, isPending] = useActionState(addUser, initialState);

  // password validation checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // check if passwords match and aren't empty
  const passwordsMatch = password === confirmPassword && password.length > 0;

  // check if all teh requirements are fullfiled
  const isPasswordValid =
    hasLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (state.status == 200 && isModalOpen) {
      toast.success(state.message);
      closeModal();
    }
    setPassword("");
    setConfirmPassword("");
  }, [state]);

  return (
    <>
      <button type="button" onClick={openModal} className="add-user-button">
        Adauga un nou membru staff
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adaugă un nou membru staff"
        footer={
          <>
            <button
              type="button"
              className="modal-action-button secondary"
              onClick={closeModal}
            >
              Anulează
            </button>
            <button
              type="submit"
              form="add-user-form"
              className="modal-action-button primary"
              disabled={!isPasswordValid || isPending}
              title={
                !isPasswordValid ? "Parola nu îndeplinește condițiile." : ""
              }
            >
              {isPending ? "Se salvează..." : "Salvează"}
            </button>
          </>
        }
      >
        <form
          action={formAction}
          id="add-user-form"
          className="contact-form add-user-form"
        >
          <input type="hidden" name="accessToken" defaultValue={accessToken} />
          {state.error && (
            <div className="modal-error" style={{ marginBottom: "1rem" }}>
              {state.error}
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Nume
              </label>
              <input
                name="lastName"
                type="text"
                id="lastName"
                className="form-input"
                placeholder="popescu"
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Prenume
              </label>
              <input
                name="firstName"
                type="text"
                id="firstName"
                className="form-input"
                placeholder="ion"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Nume utilizator
              </label>
              <input
                name="username"
                type="text"
                id="username"
                className="form-input"
                placeholder="ion.popescu"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="form-input"
                placeholder="ion.popescu@example.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Rol
            </label>
            <select
              name="role"
              className="form-input"
              id="role"
              defaultValue="moderator"
              disabled={isPending}
            >
              <option value="admin">admin</option>
              <option value="moderator">moderator</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Parolă
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirmă Parola
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="password-requirements">
            <RequirementItem isValid={hasLength} text="Cel puțin 8 caractere" />
            <RequirementItem
              isValid={hasUpper}
              text="Cel puțin o literă mare"
            />
            <RequirementItem
              isValid={hasLower}
              text="Cel puțin o literă mică"
            />
            <RequirementItem isValid={hasNumber} text="Cel puțin o cifră" />
            <RequirementItem
              isValid={hasSpecial}
              text="Cel puțin un caracter special"
            />

            <div
              style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px solid #333",
              }}
            >
              <RequirementItem
                isValid={passwordsMatch}
                text={
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "Parolele nu coincid!"
                    : "Parolele coincid"
                }
                isError={confirmPassword.length > 0 && !passwordsMatch}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

// requirement item custom helper component
const RequirementItem = ({
  isValid,
  text,
  isError = false,
}: {
  isValid: boolean;
  text: string;
  isError?: boolean;
}) => {
  return (
    <div
      className={`requirement-item ${isValid ? "is-valid" : isError ? "is-error" : ""}`}
    >
      {isValid ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      <span>{text}</span>
    </div>
  );
};
