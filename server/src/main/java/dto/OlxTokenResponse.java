package dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OlxTokenResponse {
    @JsonProperty("access_token")
    public String accessToken;

    @JsonProperty("expires_in")
    public Integer expiresIn;

    @JsonProperty("refresh_token")
    public String refreshToken;
}
