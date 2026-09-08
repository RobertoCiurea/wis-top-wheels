"use client";
import { ActionState, UserCardProps } from "../types/types";
import "@/app/styles/account.css";
import "@/app/styles/contact.css";
import { useState, useCallback, useActionState, useEffect } from "react";
import { Modal } from "./Modal";
import { PasswordInput } from "@/app/components/components";
import { updateAccount } from "../actions/updateAccountAction";
import { updatePassword } from "../actions/updatePasswordAction";
import { toast } from "sonner";
export const MyAccount = ({
  id,
  username,
  firstName,
  lastName,
  email,
  roles,
  accessToken,
}: UserCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateAccountInitialState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };
  const updatePasswordInitialState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };

  const [updateAccountState, updateAccountFormAction, isUpdateAccountPending] =
    useActionState(updateAccount, updateAccountInitialState);

  const [
    updatePasswordState,
    updatePasswordFormAction,
    isUpdatePasswordPending,
  ] = useActionState(updatePassword, updatePasswordInitialState);

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

  useEffect(() => {
    if (updateAccountState.status == 200) {
      toast.success(updateAccountState.message);
    }
  }, [updateAccountState.status, updateAccountState.message]);

  useEffect(() => {
    if (updatePasswordState.status == 200 && isModalOpen) {
      toast.success(updatePasswordState.message);
      closeModal();
    }
    setPassword("");
    setConfirmPassword("");
  }, [updatePasswordState]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className="account-container">
        <div className="account-top">
          <form action={updateAccountFormAction} className="account-form">
            {updateAccountState.error && (
              <div className="modal-error" style={{ marginBottom: "1rem" }}>
                {updateAccountState.error}
              </div>
            )}
            <input
              type="hidden"
              name="accessToken"
              defaultValue={accessToken}
            />
            <div className="form-row">
              <label htmlFor="id" className="form-label">
                ID
              </label>
              <input
                readOnly
                type="text"
                className="form-input"
                defaultValue={id}
                name="id"
                id="id"
              />
            </div>
            <div className="form-row">
              <label htmlFor="username" className="form-label">
                Nume utilizator
              </label>
              <input
                type="text"
                className="form-input"
                defaultValue={username}
                name="username"
                id="username"
              />
            </div>
            <div className="form-row">
              <label htmlFor="lastName" className="form-label">
                Nume
              </label>
              <input
                type="text"
                className="form-input"
                defaultValue={lastName}
                name="lastName"
                id="lastName"
              />
            </div>
            <div className="form-row">
              <label htmlFor="firstName" className="form-label">
                Prenume
              </label>
              <input
                type="text"
                className="form-input"
                defaultValue={firstName}
                name="firstName"
                id="firstName"
              />
            </div>
            <div className="form-row">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                defaultValue={email}
                name="email"
                id="email"
              />
            </div>
            <div className="form-row">
              <label htmlFor="role" className="form-label">
                Rol
              </label>
              {roles.map((role, index) => (
                <input
                  key={index}
                  readOnly
                  type="text"
                  className="form-input"
                  defaultValue={role}
                  name="role"
                  id="role"
                />
              ))}
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                padding: "1rem 0",
                gap: "2rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="modal-action-button change-password-button"
                onClick={openModal}
              >
                Schimbă parola
              </button>
              <button
                type="submit"
                className="modal-action-button primary"
                disabled={isUpdateAccountPending}
              >
                {isUpdateAccountPending ? "Se salvează..." : "Salvează"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Schimbă parola"
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
              form="change-password-form"
              className="modal-action-button primary"
              disabled={!isPasswordValid || isUpdatePasswordPending}
              title={
                !isPasswordValid ? "Parola nu îndeplinește condițiile." : ""
              }
            >
              {isUpdatePasswordPending ? "Se salvează..." : "Salvează"}
            </button>
          </>
        }
      >
        <form
          id="change-password-form"
          action={updatePasswordFormAction}
          className="change-password-form"
        >
          {updatePasswordState.error && (
            <div className="modal-error" style={{ marginBottom: "1rem" }}>
              {updatePasswordState.error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Parola veche
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="********"
              name="oldPassword"
              id="oldPassword"
            />
          </div>
          <PasswordInput
            passwordTitle="Parola nouă"
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
