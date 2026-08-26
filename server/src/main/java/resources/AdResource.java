package resources;

import client.OlxAdClient;
import dto.*;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheInvalidateAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import service.OlxMapperService;
import service.OlxTokenManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/api/ad")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "moderator"})
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
    @CacheInvalidateAll(cacheName = "public-ads-list")
    public Response createWheelAd(@Valid WheelAdDto wheelAdDto){
        try {
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            Map<String, Object> wheelAdPayload = mapper.toOlxWheelPayload(wheelAdDto);
            OlxSingleAdResponseDto response = adClient.createAd(authHeader, "2.0", wheelAdPayload);
            return Response.ok().entity(response).build();
        }catch (WebApplicationException e){
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }



    @PUT
    @Path("/wheels/{id}")
    @CacheInvalidateAll(cacheName = "public-ads-list")
    @CacheInvalidate(cacheName = "public-ad-details")
    public Response updateWheelAd(
            @PathParam("id") Long advertId,
            @Valid WheelAdDto wheelAdDto){
        try {
            if (advertId == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("ID is required").build();
            }
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            Map<String, Object> wheelAdPayload = mapper.toOlxWheelPayload(wheelAdDto);
            OlxSingleAdResponseDto response = adClient.updateAd(authHeader, "2.0", advertId, wheelAdPayload);
            return Response.ok().entity(response).build();
        }catch (WebApplicationException e){
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }

    @POST
    @Path("/wheels/{id}/action")
    @CacheInvalidateAll(cacheName = "public-ads-list")
    @CacheInvalidate(cacheName = "public-ad-details")
    public Response takeAction(@PathParam("id") Long advertId, AdActionDto actionDto) {
        try {
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            // build the dynamic command payload
            Map<String, Object> commandPayload = new HashMap<>();
            commandPayload.put("command", actionDto.action.getCommand());
            commandPayload.put("is_success", actionDto.isSuccess);
            // OLX rule: 'deactivate' commands must include the is_success flag
//            if (actionDto.action == OlxAdAction.DEACTIVATE) {
//                boolean successFlag = (actionDto.isSuccess != null) ? actionDto.isSuccess : true;
//                commandPayload.put("is_success", successFlag);
//            }

            // Send the command to OLX
            adClient.sendCommand(authHeader, "2.0", advertId, commandPayload);

            return Response.ok().entity("Action executed successfully").build();

        } catch (WebApplicationException e) {
            e.printStackTrace();
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Failed to execute command").build();
        }
    }

    @DELETE
    @Path("/wheels/{id}")
    @CacheInvalidateAll(cacheName = "public-ads-list")
    @CacheInvalidate(cacheName = "public-ad-details")
    public Response deleteAd(@PathParam("id") Long advertId){
        try{
            if (advertId == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("ID is missing").build();
            }
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            OlxSingleAdResponseDto advertResponse= adClient.getAd(authHeader, "2.0", advertId);
            String advertStatus = advertResponse.data.status;
            if("active".equals(advertStatus) || "limited".equals(advertStatus)){
                return Response.status(Response.Status.CONFLICT).entity("Advert status must be deactivated.").build();

            }
            adClient.deleteAd(authHeader, "2.0", advertId);
            return Response.noContent().entity("Ad deleted successfully").build();
        }catch (WebApplicationException e){
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }

}
