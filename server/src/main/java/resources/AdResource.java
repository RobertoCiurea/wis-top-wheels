package resources;

import client.OlxAdClient;
import dto.*;

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

    @GET
    @Path("/wheels")
    public Response getWheelAds(
            @QueryParam("offset") int offset,
        @QueryParam("limit") int limit
    ){
        try{
            String authHeader = "Bearer " + tokenManager.getAccessToken();
           OlxAdListResponseDto response = adClient.getAds(authHeader, "2.0", offset, limit);
            return Response.ok().entity(response).build();
        }catch (WebApplicationException e){
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }

    @GET
    @Path("/wheels/{id}")
    public Response getWheelAd(@PathParam("id") Long advertId){
        try{
            if (advertId == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("ID is required").build();
            }
            String authHeader = "Bearer " + tokenManager.getAccessToken();
            OlxSingleAdResponseDto response = adClient.getAd(authHeader, "2.0", advertId);
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
    public Response takeAction(@PathParam("id") Long advertId, AdActionDto actionDto) {
        try {
            String authHeader = "Bearer " + tokenManager.getAccessToken();

            // build the dynamic command payload
            Map<String, Object> commandPayload = new HashMap<>();
            commandPayload.put("command", actionDto.action.getCommand());

            // OLX rule: 'deactivate' commands must include the is_success flag
            if (actionDto.action == OlxAdAction.DEACTIVATE) {
                boolean successFlag = (actionDto.isSuccess != null) ? actionDto.isSuccess : true;
                commandPayload.put("is_success", successFlag);
            }

            // Send the command to OLX
            adClient.sendCommand(authHeader, "2.0", advertId, commandPayload);

            return Response.ok().entity("Action executed successfully").build();

        } catch (WebApplicationException e) {
            String error = e.getResponse().readEntity(String.class);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Failed to execute command").build();
        }
    }

    @DELETE
    @Path("/wheels/{id}")
    public Response deleteAd(@PathParam("id") Long advertId){
        try{
            if (advertId == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("ID is required").build();
            }
            String authHeader = "Bearer " + tokenManager.getAccessToken();
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
