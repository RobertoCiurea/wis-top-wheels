package resources;

import dto.UpdateAccountDto;
import dto.UpdatePasswordDto;
import dto.UpdateUserDto;
import dto.UserResponseDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

@Path("/api/account")
@RolesAllowed({"admin", "moderator"})
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AccountManagementResource {
    @Inject
    JsonWebToken jwt;
    @Inject
    Keycloak keycloak;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String REALM_NAME;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.server-url")
    String KEYCLOAK_URL;

    @ConfigProperty(name = "quarkus.oidc.client-id")
    String CLIENT_ID;

    @ConfigProperty(name = "quarkus.oidc.credentials.secret")
    String CLIENT_SECRET;

    @GET
    public Response getAccount(){
        String accountId = jwt.getSubject();
        try{
            UserRepresentation userRepresentation = keycloak.realm(REALM_NAME).users().get(accountId).toRepresentation();
            List<String> roleNames = keycloak.realm(REALM_NAME).users().get(userRepresentation.getId()).roles()
                    .realmLevel().listAll().stream().map(RoleRepresentation::getName)
                    .filter(roleName -> roleName.equals("admin") || roleName.equals("moderator"))
                    .toList();
            UserResponseDto user = new UserResponseDto(
                    userRepresentation.getId(),
                    userRepresentation.getUsername(),
                    userRepresentation.getFirstName(),
                    userRepresentation.getEmail(),
                    userRepresentation.getLastName(),
                    roleNames
            );
            return Response.ok(user).build();
        }catch (Exception e){
            e.printStackTrace();
            // Handle the case where the ID doesn't exist in Keycloak
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
            return Response.status(500).entity("Error fetching user: " + e.getMessage()).build();
        }

    }
    @PUT

    public Response updateAccount(UpdateAccountDto updatedUser){
        String accountId = jwt.getSubject();
        try {
            UserResource userResource = keycloak.realm(REALM_NAME).users().get(accountId);
            UserRepresentation userRepresentation = userResource.toRepresentation();

            userRepresentation.setUsername(updatedUser.username());
            userRepresentation.setFirstName(updatedUser.firstName());
            userRepresentation.setLastName(updatedUser.lastName());
            userRepresentation.setEmail(updatedUser.email());
            userResource.update(userRepresentation);
            return Response.ok().entity("Account successfully updated").build();

        }catch (NotFoundException e){
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Account not found")
                    .build();
        }catch (WebApplicationException e){
            if(e.getResponse().getStatus() == 409){
                return Response.status(Response.Status.CONFLICT)
                        .entity("Username or email already used")
                        .build();
            }
            return Response.status(e.getResponse().getStatus())
                    .entity("Keycloak error: " + e.getMessage())
                    .build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.status(500)
                    .entity("Server error: " + e.getMessage())
                    .build();
        }

    }
    @PUT
    @Path("/password")
    public Response updatePassword(UpdatePasswordDto updatePasswordDto){
        String accountId = jwt.getSubject();
        String username = jwt.getName();
        try{
            boolean isOldPasswordCorrect = verifyOldPassword(username, updatePasswordDto.oldPassword());
            if(!isOldPasswordCorrect){
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Password is incorrect")
                        .build();
            }
            CredentialRepresentation credentials = new CredentialRepresentation();
            credentials.setType(CredentialRepresentation.PASSWORD);
            credentials.setValue(updatePasswordDto.newPassword());
            credentials.setTemporary(false);
            keycloak.realm(REALM_NAME).users().get(accountId).resetPassword(credentials);
            return Response.ok().entity("Password updated successfully").build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.status(500).entity("Server error: " + e.getMessage()).build();
        }
    }
        private boolean verifyOldPassword(String username, String oldPassword) throws IOException, InterruptedException {
            String tokenEndpoint = KEYCLOAK_URL + "/realms/" + REALM_NAME +"/protocol/openid-connect/token";
            String requestBody = "client_id=" + CLIENT_ID +
                    "&client_secret=" + CLIENT_SECRET +
                    "&grant_type=password" +
                    "&username=" + username +
                    "&password=" + oldPassword;

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(tokenEndpoint))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // If the status is 200 OK, Keycloak accepted the credentials.
            return response.statusCode() == 200;
        }
}
