package dto;

public class RecaptchaResponseDto {
    public TokenProperties tokenProperties;

    public static class TokenProperties {
        public boolean valid;
        public String invalidReason;
    }
}