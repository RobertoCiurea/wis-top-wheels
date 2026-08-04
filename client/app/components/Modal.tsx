"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { ModalProps } from "../types/types";

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "560px",
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      const timeoutId = window.setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 220);
      return () => window.clearTimeout(timeoutId);
    }

    setIsVisible(true);
    setIsClosing(false);
    lastFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusableSelector =
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

    const focusTimer = window.setTimeout(() => {
      //check if the currently focused element is already inside the modal
      //if the user is typing in a password field dont steal the focus
      if (!dialogRef.current?.contains(document.activeElement)) {
        const firstFocusable =
          dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
        firstFocusable?.focus();
      }
    }, 20);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ??
            [],
        ).filter((element) => !element.hasAttribute("disabled"));

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      lastFocusedElement.current?.focus();
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div
      className={`modal-backdrop ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`modal-panel ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ maxWidth }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            {description ? (
              <p className="modal-description">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Închide dialogul"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
};
