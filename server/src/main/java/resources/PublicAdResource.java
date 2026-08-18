package resources;

import client.OlxAdClient;
import dto.OlxAdListResponseDto;
import dto.OlxSingleAdResponseDto;
import io.quarkus.cache.CacheResult;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import service.OlxMapperService;
import service.OlxTokenManager;

@Path("/api/ad")
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
public class PublicAdResource {

    @Inject
    OlxTokenManager tokenManager;

    @Inject
    @RestClient
    OlxAdClient adClient;

    @Inject
    OlxMapperService mapper;

    @GET
    @Path("/wheels")
    @CacheResult(cacheName = "public-ads-list")
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
    @CacheResult(cacheName = "public-ad-details")
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
}
