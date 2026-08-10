package resources;

import client.OlxAdClient;
import dto.WheelAdDto;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import service.OlxMapperService;
import service.OlxTokenManager;

import java.util.Map;

@Path("/api/ad")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AdResource {

    @Inject
    OlxTokenManager tokenManager;

    @Inject
    @RestClient
    OlxAdClient adClient;

    @Inject
    OlxMapperService mapper;

    @POST
    @Path("/wheels")
    public Response createWheelAd(WheelAdDto wheelAdDto){
        try {
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            Log.info(authHeader);
            Map<String, Object> wheelAdPayload = mapper.toOlxWheelPayload(wheelAdDto);
            Map<String, Object> response = adClient.createAd(authHeader, wheelAdPayload);
            return Response.ok().entity(response).build();
        }catch (WebApplicationException e){
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }

}
