package client;

import dto.OlxAdListResponseDto;
import dto.OlxAdResponseDto;
import dto.OlxSingleAdResponseDto;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;
import java.util.Map;

@RegisterRestClient(configKey = "olx-api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path("/api/partner/adverts")
@ClientHeaderParam(name = "Version", value = "2.0")
public interface OlxAdClient {

    @POST
    OlxSingleAdResponseDto createAd(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            Map<String, Object> payload
            );
    @GET
    OlxAdListResponseDto getAds(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            @QueryParam("offset") int offset,
            @QueryParam("limit") int limit
    );

    @GET
    @Path("/{advertId}")
   OlxSingleAdResponseDto getAd(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            @PathParam("advertId") Long id
    );

    @PUT
    @Path("/{advertId")
    OlxSingleAdResponseDto updateAd(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            @PathParam("advertId") Long id,
            Map<String, Object> payload
    );

    @DELETE
    @Path("/{advertId")
    void deleteAd(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            @PathParam("advertId") Long id
    );


    @POST
    @Path("/{advertId}/commands")
    void sendCommand(
            @HeaderParam("Authorization") String authHeader,
            @HeaderParam("Version") String version,
            @PathParam("advertId") Long id,
            Map<String, Object> commandPayload
    );


}
