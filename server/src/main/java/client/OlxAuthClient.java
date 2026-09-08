package client;

import dto.OlxTokenResponse;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "olx-api")
public interface OlxAuthClient {

    @POST
    @Path("/api/open/oauth/token")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    OlxTokenResponse fetchToken(
            @FormParam("grant_type")  String grantType,
            @FormParam("client_id") String clientId,
            @FormParam("client_secret") String clientSecret,
            @FormParam("scope") String scope,
            @FormParam("refresh_token") String refreshToken,
            @FormParam("code") String code,
            @FormParam("redirect_uri") String redirectUri

    );
}
