"use client";
import { useState, useCallback, useActionState, useEffect } from "react";
import { Modal } from "@/app/components/Modal";
import "@/app/styles/contact.css";
import { ActionState } from "../types/types";
import { addUser } from "../actions/addUserAction";
import { toast } from "sonner";
import { PasswordInput } from "@/app/components/PasswordInput";
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
          <PasswordInput
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            hasLength={hasLength}
            hasUpper={hasUpper}
            hasLower={hasLower}
            hasNumber={hasNumber}
            hasSpecial={hasSpecial}
            passwordsMatch={passwordsMatch}
          />
        </form>
      </Modal>
    </>
  );
};
