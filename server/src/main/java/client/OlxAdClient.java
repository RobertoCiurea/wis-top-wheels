package client;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.Map;

@RegisterRestClient(configKey = "olx-api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path("/api/partner/adverts")
@ClientHeaderParam(name = "Version", value = "2.0")
public interface OlxAdClient {

    @POST
    Map<String, Object> createAd(
            @HeaderParam("Authorization") String authHeader,
            Map<String, Object> payload
            );
    @GET
    Map<String, Object> getAds(
            @HeaderParam("Authorization") String authHeader
    );
}
