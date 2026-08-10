package resources;

import client.OlxAuthClient;
import dto.OlxTokenResponse;
import entity.OlxTokenEntity;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.Instant;

@Path("/api/olx/auth")
public class OlxAuthResource {
    @ConfigProperty(name = "OLX_CLIENT_ID")
    String clientId;

    @ConfigProperty(name = "OLX_CLIENT_SECRET")
    String clientSecret;

    @ConfigProperty(name = "OLX_REDIRECT_URL_BASE")
    String redirectUriBase;

    @Inject
            @RestClient
    OlxAuthClient olxAuthClient;

    @GET
    @Path("/setup")
    @PermitAll
    @Transactional
    public Response setupOlx(@QueryParam("code") String code){
        String redirectUri = redirectUriBase + "/api/olx/auth/setup";
        try{
            if(code == null){
                String url = "https://www.olx.ro/oauth/authorize/?client_id=" + clientId +
                        "&response_type=code&scope=v2 read write&redirect_uri=" + redirectUri;
                String html = "<h2>Setup OLX WIS Top Wheels</h2><a href='" + url + "'>Click Aici pentru a Autoriza Aplicatia</a>";
                return Response.ok(html).type(MediaType.TEXT_HTML).build();
            }else{
                OlxTokenResponse response = olxAuthClient.fetchToken(
                        "authorization_code",
                        clientId,
                        clientSecret,
                        "v2 read write",
                        null,
                        code,
                        redirectUri
                );
                OlxTokenEntity tokenRecord = OlxTokenEntity.findById("SINGLETON");
                if(tokenRecord == null){
                     tokenRecord = new OlxTokenEntity();
                     tokenRecord.id="SINGLETON";
                }
                tokenRecord.refreshToken = response.refreshToken;
                tokenRecord.updatedAt = Instant.now();
                tokenRecord.persist();;
                return Response.ok().entity(tokenRecord).build();
            }
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Something went wrong with the OLX API connection").build();
        }

    }
}
