"use client";

import { Circle, CheckCircle2 } from "lucide-react";
import { PasswordProps } from "../types/types";
export const PasswordInput = ({
  passwordTitle,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  hasLength,
  hasUpper,
  hasLower,
  hasNumber,
  hasSpecial,
  passwordsMatch,
}: PasswordProps) => {
  return (
    <>
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          {passwordTitle ? passwordTitle : "Parolă"}
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
        <RequirementItem isValid={hasUpper} text="Cel puțin o literă mare" />
        <RequirementItem isValid={hasLower} text="Cel puțin o literă mică" />
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
