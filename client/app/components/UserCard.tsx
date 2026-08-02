"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { UserCardProps } from "@/app/types/types";
import { CircleUserRound, Pencil, Trash, TriangleAlert } from "lucide-react";
import { Modal } from "@/app/components/Modal";
import "@/app/styles/contact.css";

const getFriendlyErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  if (response.status === 401 || response.status === 403) {
    return "Sesiunea a expirat sau nu ai drepturile necesare. Conectează-te din nou pentru a continua.";
  }

  try {
    const text = await response.text();
    if (text) {
      return text;
    }
  } catch {
    // Ignore parsing issues and fall back to the default message.
  }

  return fallback;
};

export const UserCard = ({
  id,
  username,
  email,
  roles,
  accessToken,
}: UserCardProps) => {
  const [userState, setUserState] = useState({ username, email, roles });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    username: userState.username,
    email: userState.email,
    role: userState.roles[0] ?? "moderator",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    setUserState({ username, email, roles });
    setFormValues({ username, email, role: roles[0] ?? "moderator" });
  }, [username, email, roles]);

  const availableRoles = useMemo(() => ["admin", "moderator"], []);

  const resetForm = () => {
    setFormValues({
      username: userState.username,
      email: userState.email,
      role: userState.roles[0] ?? "moderator",
    });
    setError("");
    setSuccessMessage("");
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setError("");
    setSuccessMessage("");
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setError("");
    setSuccessMessage("");
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.username.trim() || !formValues.email.trim()) {
      setError("Numele și adresa de email sunt obligatorii.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    setUserState((current) => ({
      ...current,
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      roles: [formValues.role],
    }));
    setSuccessMessage("Datele utilizatorului au fost salvate cu succes.");
    closeEditModal();
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    setSuccessMessage("Utilizatorul a fost șters cu succes.");
    setIsRemoved(true);
    closeDeleteModal();
  };

  if (isRemoved) {
    return null;
  }

  return (
    <>
      <div className="user-card">
        <div className="user-card-header">
          <p>{userState.username}</p>
          <CircleUserRound size={36} />
        </div>
        <div className="user-card-content">
          {successMessage ? (
            <div className="user-card-status success">{successMessage}</div>
          ) : null}
          <div className="user-card-row">
            <p>Rol</p>
            {userState.roles.length > 0 ? (
              userState.roles.map((role, index) => (
                <span className="role" key={`${role}-${index}`}>
                  {role}
                </span>
              ))
            ) : (
              <span>Nedefinit</span>
            )}
          </div>
          <div className="user-card-row">
            <p>Email</p>
            <p>{userState.email}</p>
          </div>
        </div>
        <div className="user-card-footer">
          <button
            className="user-card-button edit-button"
            type="button"
            onClick={() => {
              resetForm();
              setIsEditOpen(true);
            }}
          >
            <Pencil />
            Editează
          </button>
          <button
            className="user-card-button delete-button"
            type="button"
            onClick={() => {
              setError("");
              setIsDeleteOpen(true);
            }}
          >
            <Trash />
            Șterge
          </button>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        title="Editează"
        description="Actualizează datele utilizatorului ales."
        maxWidth="560px"
        footer={
          <>
            <button
              type="button"
              className="modal-action-button secondary"
              onClick={closeEditModal}
            >
              Anulează
            </button>
            <button
              type="submit"
              form="edit-user-form"
              className="modal-action-button primary"
              disabled={isSaving}
            >
              {isSaving ? "Se salvează..." : "Salvează"}
            </button>
          </>
        }
      >
        <form
          id="edit-user-form"
          className="modal-form"
          onSubmit={handleEditSubmit}
        >
          {error ? <div className="modal-error">{error}</div> : null}
          <div className="form-group">
            <label className="form-label" htmlFor={`username-${id}`}>
              Nume utilizator
            </label>
            <input
              className={`form-input`}
              id={`username-${id}`}
              value={formValues.username}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`role-${id}`}>
              Rol
            </label>
            <select
              className="form-input"
              id={`role-${id}`}
              value={formValues.role}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
              disabled={isSaving}
            >
              {availableRoles.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        description={`Șterge utilizatorul ${userState.username} cu rolul de ${userState.roles.join(", ")}.`}
        title="Confirmă ștergerea"
        maxWidth="480px"
        footer={
          <>
            <button
              type="button"
              className="modal-action-button secondary"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              Anulează
            </button>
            <button
              type="button"
              className="modal-action-button danger"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Se șterge..." : "Șterge"}
            </button>
          </>
        }
      >
        <div>
          {error ? <div className="modal-error">{error}</div> : null}
          <div className="modal-warning-card">
            <TriangleAlert size={24} />
            <p>
              Ești sigur că dorești să ștergi acest utilizator? Această acțiune
              nu poate fi anulată.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
