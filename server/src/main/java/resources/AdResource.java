package resources;

import client.OlxAdClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.*;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.logging.Log;
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
            Log.error("Error updating advert ID " + advertId +" Error: " + error);
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
            if(advertId == null || actionDto == null || actionDto.action == null){
                Map<String, Object> errorPayload = new HashMap<>();
                errorPayload.put("status", 400);
                errorPayload.put("error", "ID-ul anunțului și acțiunea sunt obligatorii.");
                return Response.status(Response.Status.BAD_REQUEST).entity(errorPayload).build();
            }
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
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("status", 200);
            successResponse.put("message", "Acțiunea a fost aplicată cu succes.");
            return Response.ok().entity(successResponse).build();

        } catch (WebApplicationException e) {

            e.printStackTrace();
            int statusCode = e.getResponse().getStatus();
            String error = e.getResponse().readEntity(String.class);
            Log.error("Olx Error for advert ID: " + advertId  + "Error message: " + error);
             Map<String, Object> frontendError = new HashMap<>();
             frontendError.put("status", statusCode);
             try {
                 ObjectMapper jsonMapper = new ObjectMapper();
                 JsonNode rootNode = jsonMapper.readTree(error);
                 JsonNode errorNode = rootNode.path("error");
                 String detailMessage="";

                 JsonNode validationNode = errorNode.path("validation");
                 if(validationNode.isArray() && validationNode.size() >0){
                     StringBuilder validationMessages = new StringBuilder();
                     for(JsonNode node : validationNode){
                         String detail = node.path("detail").asText();
                         if(detail != null && !detail.isEmpty()){
                             if(validationMessages.length() > 0){ //there are more message
                                 validationMessages.append(" | ");

                             }
                             validationMessages.append(detail);
                         }
                     }
                     detailMessage = validationMessages.toString();
                 }

                 //if there is no validation section fallback to default olx error response
                 if(detailMessage.isEmpty()){
                     detailMessage = errorNode.path("detail").asText();
                 }

                 //if this shit doesn't work either then fallback to default message
                 if(detailMessage == null || detailMessage.isEmpty()){
                     detailMessage ="OLX a respins acțiunea. Verifică datele și starea curentă a anunțului.";
                 }
                 frontendError.put("error", detailMessage);
             }catch (Exception parseException) {
                 frontendError.put("error", "Eroare de comunicare la nivelul rețelei OLX.");
             }
            return Response.status(statusCode).entity(frontendError).build();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> serverError = new HashMap<>();
            serverError.put("status", 500);
            serverError.put("error", "Eroare internă a serverului la executarea acțiunii.");

            return Response.serverError().entity(serverError).build();
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
            Log.error("Olx Error for advert ID: " + advertId  + "Error message: " + error);
            return Response.status(e.getResponse().getStatus()).entity(error).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity("Networking error. Try again!").build();

        }

    }

}
