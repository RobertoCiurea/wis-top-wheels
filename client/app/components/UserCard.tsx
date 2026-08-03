"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { UserCardProps } from "@/app/types/types";
import { CircleUserRound, Pencil, Trash, TriangleAlert } from "lucide-react";
import { Modal } from "@/app/components/Modal";
import { ActionState } from "@/app/types/types";
import { useActionState } from "react";
import { updateUser } from "@/app/actions/updateUserAction";
import "@/app/styles/contact.css";

export const UserCard = ({
  id,
  username,
  email,
  roles,
  accessToken,
}: UserCardProps) => {
  const initialState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };

  //useActionState hook initialization
  const [state, formAction, isPending] = useActionState(
    updateUser,
    initialState,
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="user-card">
        <div className="user-card-header">
          <p>{username}</p>
          <CircleUserRound size={36} />
        </div>
        <div className="user-card-content">
          {/* {successMessage ? (
            <div className="user-card-status success">{successMessage}</div>
          ) : null} */}
          <div className="user-card-row">
            <p>Rol</p>
            {roles.length > 0 ? (
              roles.map((role, index) => (
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
            <p>{email}</p>
          </div>
        </div>
        <div className="user-card-footer">
          <button
            className="user-card-button edit-button"
            type="button"
            onClick={() => {
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
              disabled={isPending}
            >
              {isPending ? "Se salvează..." : "Salvează"}
            </button>
          </>
        }
      >
        <form id="edit-user-form" className="modal-form" action={formAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="accessToken" value={accessToken} />
          {state.error && <div className="modal-error">{state.error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor={`username-${id}`}>
              Nume utilizator
            </label>
            <input
              name="username"
              className={`form-input`}
              id={`username-${id}`}
              defaultValue={username}
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`role-${id}`}>
              Rol
            </label>
            <select
              name="role"
              className="form-input"
              id={`role-${id}`}
              defaultValue={roles[0]}
              disabled={isPending}
            >
              <option value="admin">admin</option>
              <option value="moderator">moderator</option>
            </select>
          </div>
        </form>
      </Modal>
      {/* 
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        description={`Șterge utilizatorul ${username} cu rolul de ${roles.join(", ")}.`}
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
      </Modal> */}
    </>
  );
};
