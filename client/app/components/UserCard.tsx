"use client";

import { useEffect, useState } from "react";
import { UserCardProps } from "@/app/types/types";
import { CircleUserRound, Pencil, Trash, TriangleAlert } from "lucide-react";
import { Modal } from "@/app/components/Modal";
import { ActionState } from "@/app/types/types";
import { useActionState } from "react";
import { updateUser } from "@/app/actions/updateUserAction";
import { deleteUser } from "../actions/deleteUserAction";
import "@/app/styles/contact.css";
import { toast } from "sonner";

export const UserCard = ({
  id,
  username,
  email,
  firstName,
  lastName,
  roles,
  currentUserEmail,
}: UserCardProps) => {
  const initialEditState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };
  const initialDeleteState: ActionState = {
    status: 0,
    error: "",
    message: "",
  };

  //useActionState hook initialization
  const [editState, editFormAction, editIsPending] = useActionState(
    updateUser,
    initialEditState,
  );

  const [deleteState, deleteFormAction, deleteIsPending] = useActionState(
    deleteUser,
    initialDeleteState,
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  useEffect(() => {
    if (editState.status === 200 && isEditOpen) {
      setIsEditOpen(false);
      toast.success(
        editState.message || "Datele utilizatorului au fost salvate cu succes.",
      );
    }
  }, [editState]);

  useEffect(() => {
    if (deleteState.status === 200 && isDeleteOpen) {
      setIsDeleteOpen(false);
      toast.success(
        deleteState.message || "Utilizatorul a fost șters cu succes!",
      );
    }
  }, [deleteState]);

  const isCurrentUser = currentUserEmail === email;

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className={`user-card ${isCurrentUser ? "current-user-card" : ""}`}>
        <div
          className={`user-card-header ${isCurrentUser ? "current-user-header" : ""}`}
        >
          <p>{username}</p>
          <CircleUserRound size={36} />
        </div>
        <div className="user-card-content">
          <div className="user-card-row">
            <p>Nume</p>
            <p>{lastName}</p>
          </div>
          <div className="user-card-row">
            <p>Prenume</p>
            <p>{firstName}</p>
          </div>
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
            className={`user-card-button edit-button ${isCurrentUser ? "disabled" : ""}`}
            type="button"
            disabled={isCurrentUser}
            title={isCurrentUser ? "Nu poți edita propriul cont." : ""}
            onClick={() => {
              setIsEditOpen(true);
            }}
          >
            <Pencil />
            Editează
          </button>
          <button
            className={`user-card-button delete-button ${isCurrentUser ? "disabled" : ""} `}
            type="button"
            disabled={isCurrentUser}
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
              form={`edit-user-form-${id}`}
              className="modal-action-button primary"
              disabled={editIsPending}
            >
              {editIsPending ? "Se salvează..." : "Salvează"}
            </button>
          </>
        }
      >
        <form
          id={`edit-user-form-${id}`}
          className="modal-form"
          action={editFormAction}
        >
          <input type="hidden" name="id" value={id} />
          {editState.error && (
            <div className="modal-error">{editState.error}</div>
          )}
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
              disabled={editIsPending}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={`lastName-${id}`}>
              Nume
            </label>
            <input
              name="lastName"
              className={`form-input`}
              id={`lastName-${id}`}
              defaultValue={lastName}
              required
              disabled={editIsPending}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={`firstName-${id}`}>
              Prenume
            </label>
            <input
              name="firstName"
              className={`form-input`}
              id={`firstName-${id}`}
              defaultValue={firstName}
              required
              disabled={editIsPending}
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
              disabled={editIsPending}
            >
              <option value="admin">admin</option>
              <option value="moderator">moderator</option>
            </select>
          </div>
        </form>
      </Modal>

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
            >
              Anulează
            </button>

            <button
              form={`delete-user-form-${id}`}
              type="submit"
              className="modal-action-button danger"
            >
              {deleteIsPending ? "Se șterge..." : "Șterge"}
            </button>
          </>
        }
      >
        <form
          id={`delete-user-form-${id}`}
          className="modal-form"
          action={deleteFormAction}
        >
          {deleteState.error && (
            <div className="modal-error">{deleteState.error}</div>
          )}
          <input type="hidden" name="id" value={id} />
          <div className="modal-warning-card">
            <TriangleAlert size={24} />
            <p>
              Ești sigur că dorești să ștergi acest utilizator? Această acțiune
              nu poate fi anulată.
            </p>
          </div>
        </form>
      </Modal>
    </>
  );
};
