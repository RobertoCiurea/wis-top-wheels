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
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.net.URI;
import java.time.Instant;
import java.util.Map;

@Path("/api/olx/auth")
public class OlxAuthResource {
    @ConfigProperty(name = "OLX_CLIENT_ID")
    String clientId;

    @ConfigProperty(name = "OLX_CLIENT_SECRET")
    String clientSecret;

    @ConfigProperty(name = "OLX_REDIRECT_URL_BASE")
    String redirectUriBase;

    @ConfigProperty(name = "NEXT_BASE_URL")
    String nextUriBase;

    @Inject
            @RestClient
    OlxAuthClient olxAuthClient;

    @GET
    @Path("/setup")
    @PermitAll
    //change it later in production
    //@RolesAllowed({"admin", "moderator"})

    @Transactional
    public Response setupOlx(@QueryParam("code") String code){
        String redirectUri = redirectUriBase + "/api/olx/auth/setup";
        try{
            if(code == null){
                String url = "https://www.olx.ro/oauth/authorize/?client_id=" + clientId +
                        "&response_type=code&scope=v2 read write&redirect_uri=" + redirectUri;
                return Response.ok(url).type(MediaType.TEXT_PLAIN).build();
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
                URI frontendRedirect = URI.create(nextUriBase + "/dashboard?olx=success");
                return Response.seeOther(frontendRedirect).build();
            }
        }catch (Exception e){
            e.printStackTrace();
            URI frontendError = URI.create(nextUriBase + "/dashboard?olx=error");
            return Response.seeOther(frontendError).build();
        }

    }


    @Path("/status")
    @GET
    @PermitAll //change later to RolesAllowed
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOlxConnectionStatus(){
        try{
            OlxTokenEntity tokenRecord = OlxTokenEntity.findById("SINGLETON");
                boolean isConnected = (tokenRecord!=null
                        && tokenRecord.refreshToken!=null
                        && !tokenRecord.refreshToken.trim().isEmpty());
                return Response.ok(Map.of("isConnected", isConnected)).build();
            }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Error connecting "+ e.getMessage()).build();
        }
    }
}
