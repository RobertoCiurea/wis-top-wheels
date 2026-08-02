package resources;

import dto.CreateUserDto;
import dto.UpdateUserDto;
import dto.UserResponseDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

@Path("/api/admin/users")
@RolesAllowed("admin")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserManagementResource {
    @Inject
    Keycloak keycloak; //keycloak client
    private static final String REALM_NAME = "wis-top-wheels-realm"; //get it later from env

    @GET
    public Response getAllUsers() {
        //Fetch all users
        List<UserRepresentation> kcUsers = keycloak.realm(REALM_NAME).users().list();
        //Map keycloak users to UserResponseDto
        List<UserResponseDto> users = kcUsers.stream().map(user -> {
            //get the user's roles (only moderator and admin)
            List<String> rolesNames = keycloak.realm(REALM_NAME).users().get(user.getId())
                    .roles().realmLevel().listAll().stream()
                    .map(RoleRepresentation::getName)
                    .filter(roleName -> roleName.equals("admin") || roleName.equals("moderator"))
                    .toList();
            //convert user to dto
            return new UserResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    rolesNames);
        }).toList();
        return Response.ok(users).build();
    }

    @GET
    @Path("/{id}")
    public Response getUser(@PathParam("id") String userId){
        try{
            UserResource userResource = keycloak.realm(REALM_NAME).users().get(userId);
            UserRepresentation user = userResource.toRepresentation();
            List<String> roleNames = userResource.roles().realmLevel().listAll().stream()
                    .map(RoleRepresentation::getName)
                    .filter(roleName -> roleName.equals("admin") || roleName.equals("moderator"))
                    .toList();
            UserResponseDto userResponseDto = new UserResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    roleNames
            );
            return Response.ok().entity(userResponseDto).build();
        }catch (Exception e){
            e.printStackTrace();
            // Handle the case where the ID doesn't exist in Keycloak
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
            return Response.status(500).entity("Error fetching user: " + e.getMessage()).build();
        }
    }

    @POST
    public Response createUser(CreateUserDto UserRequest) {
        //Create keycloak user object
        UserRepresentation user = new UserRepresentation();
        user.setUsername(UserRequest.username());
        user.setEmail(UserRequest.email());
        user.setEnabled(true);
        user.setEmailVerified(true);

        //set up the password credentials
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(UserRequest.password());
        credential.setTemporary(false);

        //add credentials to the user
        user.setCredentials(List.of(credential));

        //send user to keycloak server
        try (Response response = keycloak.realm(REALM_NAME).users().create(user)) {
            if (response.getStatus() == 409)
                return Response.status(409).entity("User already exists").build();
            if (response.getStatus() != 201)
                return Response.status(response.getStatus()).entity("Failed to create user").build();
            //get the created user id from the response
            String userId = CreatedResponseUtil.getCreatedId(response);

            //assign role to user
            RoleRepresentation role = keycloak.realm(REALM_NAME).roles().get(UserRequest.role()).toRepresentation();
            keycloak.realm(REALM_NAME).users().get(userId).roles().realmLevel().add(List.of(role));

            //get the createdUser
            UserResource userResource = keycloak.realm(REALM_NAME).users().get(userId);
            UserRepresentation userRepresentation = userResource.toRepresentation();
            //get user roles (admin, moderator)
            List<String> roleNames = userResource.roles().realmLevel().listAll().stream()
                    .map(RoleRepresentation::getName)
                    .filter(roleName -> roleName.equals("admin") || roleName.equals("moderator"))
                    .toList();
            UserResponseDto userResponseDto = new UserResponseDto(
                    userRepresentation.getId(),
                    userRepresentation.getUsername(),
                    userRepresentation.getEmail(),
                   roleNames
            );
            return Response.status(201).entity(userResponseDto).build();
        } catch (Exception e) {
            return Response.status(500).entity("Error connecting to keycloak" + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") String userId, UpdateUserDto updatedUser) {
        try {
            //get the UserResource based on userId
            UserResource userResource = keycloak.realm(REALM_NAME).users().get(userId);

            //get the user representation (the actual user data)
            UserRepresentation user = userResource.toRepresentation();

            //update user properties (username)
            user.setUsername(updatedUser.username());

            //save the profile
            userResource.update(user);

            //handle role swapping (remove existent roles and add the new ones)
            //get the current user's roles
            List<RoleRepresentation> currentRoles = userResource.roles().realmLevel().listAll();

            //filter the roles that interest us (admin and moderator)
            List<RoleRepresentation> rolesToRemove = currentRoles.stream()
                    .filter(role -> role.getName().equals("admin") || role.getName().equals("moderator"))
                    .toList();
            if (!rolesToRemove.isEmpty()) {
                userResource.roles().realmLevel().remove(rolesToRemove);
            }

            //assign the new role to the user
            RoleRepresentation role = keycloak.realm(REALM_NAME).roles().get(updatedUser.role()).toRepresentation();
            userResource.roles().realmLevel().add(List.of(role));

            return Response.ok().entity("User updated successfully").build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error to your Quarkus console
            //check if keycloak rejected the username
            if (e.getMessage() != null && e.getMessage().contains("409")) {
                return Response.status(409).entity("Username already exists").build();
            }
            if(e.getMessage()!=null && e.getMessage().contains("404")){
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
            return Response.status(500).entity("Error updating user: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") String userId){
        try{
            keycloak.realm(REALM_NAME).users().delete(userId);
            return Response.noContent().entity("User deleted successfully").build();
        }catch(Exception e){
            if(e.getMessage()!=null && e.getMessage().contains("404"))
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        return Response.status(500).entity("Error deleting user: " + e.getMessage()).build();
        }
    }
}