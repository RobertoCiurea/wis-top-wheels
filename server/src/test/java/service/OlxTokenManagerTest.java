package service;

import client.OlxAuthClient;
import dto.OlxTokenResponse;
import entity.OlxTokenEntity;
import exception.RefreshTokenException;
import exception.TokenNotFoundException;
import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@QuarkusTest
public class OlxTokenManagerTest {

    @Inject
    OlxTokenManager tokenManager;

    @InjectMock
    @RestClient
    OlxAuthClient olxAuthClient;

    @BeforeEach
    void setUp(){
        tokenManager.resetTokenState();
        PanacheMock.mock(OlxTokenEntity.class);
        Mockito.clearInvocations(olxAuthClient);
    }

    @Test
    void shouldRefreshToken(){
        OlxTokenEntity tokenEntity= new OlxTokenEntity();
        tokenEntity.id="SINGLETON";
        tokenEntity.refreshToken="old-refresh-token";

        OlxTokenResponse response = new OlxTokenResponse();
        response.accessToken="access-token";
        response.expiresIn=3600;
        response.refreshToken=null;

        when(OlxTokenEntity.findById("SINGLETON")).thenReturn(tokenEntity);
        when(olxAuthClient.fetchToken(
                eq("refresh_token"),
                anyString(),
                anyString(),
                isNull(),
                eq("old-refresh-token"),
                isNull(),
                isNull()
        )).thenReturn(response);

        String accessToken = tokenManager.getAccessToken();
        assertEquals("access-token", accessToken);
        verify(olxAuthClient).fetchToken(
                eq("refresh_token"),
                anyString(),
                anyString(),
                isNull(),
                eq("old-refresh-token"),
                isNull(),
                isNull()
        );
    }

    @Test
    void shouldReuseAccessToken(){
        OlxTokenEntity tokenEntity = new OlxTokenEntity();
        tokenEntity.id="SINGLETON";
        tokenEntity.refreshToken="old-refresh-token";

        OlxTokenResponse response = new OlxTokenResponse();
        response.accessToken="access-token";
        response.refreshToken=null;
        response.expiresIn=3600;
        when(OlxTokenEntity.findById("SINGLETON"))
                .thenReturn(tokenEntity);
        when(olxAuthClient.fetchToken(
                eq("refresh_token"),
                anyString(),
                anyString(),
                isNull(),
                eq("old-refresh-token"),
               isNull(),
                isNull()
        )).thenReturn(response);
        String firstToken = tokenManager.getAccessToken();
        String secondToken=tokenManager.getAccessToken();

        assertEquals("access-token", firstToken);
        assertEquals("access-token", secondToken);

    verify(olxAuthClient, times(1)).fetchToken(
            eq("refresh_token"),
            anyString(),
            anyString(),
            isNull(),
            eq("old-refresh-token"),
            isNull(),
            isNull()
    );
    };

    @Test
    void shouldThrowWhenRefreshTokenIsNull(){
        OlxTokenEntity tokenEntity = new OlxTokenEntity();
        tokenEntity.id="SINGLETON";
        tokenEntity.refreshToken=null;

        when(OlxTokenEntity.findById("SINGLETON")).thenReturn(tokenEntity);
        assertThrows(TokenNotFoundException.class, ()->tokenManager.getAccessToken());
        verifyNoInteractions(olxAuthClient);
    }

    @Test
    void shouldWrapOlxFailureInRefreshTokenException(){
        OlxTokenEntity tokenEntity = new OlxTokenEntity();
        tokenEntity.id="SINGLETON";
        tokenEntity.refreshToken="refresh-token";
        when(OlxTokenEntity.findById("SINGLETON")).thenReturn(tokenEntity);

        when(olxAuthClient.fetchToken(
                anyString(),
                anyString(),
                anyString(),
                any(),
                anyString(),
                anyString(),
                anyString()
        )).thenThrow(new RuntimeException("Olx unavailable"));

        assertThrows(RefreshTokenException.class,
                ()->tokenManager.getAccessToken());
    }
}
