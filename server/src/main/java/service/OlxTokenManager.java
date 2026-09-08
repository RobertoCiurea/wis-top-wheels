package service;

import client.OlxAdClient;
import client.OlxAuthClient;
import dto.OlxTokenResponse;
import entity.OlxTokenEntity;
import exception.RefreshTokenException;
import exception.TokenNotFoundException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.Instant;

@ApplicationScoped
public class OlxTokenManager {

    @Inject
    @RestClient
   OlxAuthClient olxAuthClient;

    @ConfigProperty(name = "OLX_CLIENT_ID")
    String clientId;

    @ConfigProperty(name = "OLX_CLIENT_SECRET")
    String clientSecret;

    private String currentToken=null;
    private Instant expiresAt=Instant.EPOCH;

    @Transactional
    public synchronized String getAccessToken() {
        if (Instant.now().isAfter(expiresAt.minusSeconds(60))) {
            refreshToken();
        }
        return currentToken;
    }
        public void refreshToken(){
            try{
                OlxTokenEntity tokenRecord = OlxTokenEntity.findById("SINGLETON");
                if(tokenRecord == null || tokenRecord.refreshToken == null)
                    throw new TokenNotFoundException("Token not found. Register to OlX app.");

                OlxTokenResponse response = olxAuthClient.fetchToken(
                        "refresh_token",
                        clientId,
                        clientSecret,
                        null,
                        tokenRecord.refreshToken,
                        null,
                        null
                );

                this.currentToken = response.accessToken;
                this.expiresAt = Instant.now().plusSeconds(response.expiresIn);
                if(response.refreshToken != null){
                    tokenRecord.refreshToken = response.refreshToken;
                    tokenRecord.updatedAt=Instant.now();
                    tokenRecord.persist();
                }
            }catch (Exception e){
                e.printStackTrace();
                throw new RefreshTokenException("Unabled to refresh OLX token");
            }

        }

}

