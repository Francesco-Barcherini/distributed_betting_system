package it.unipi.distributed_betting_system.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private boolean isAdmin;
    private long expiryTimeEpochSeconds;

    public AuthResponse(String token, Long id, boolean isAdmin, long expiryTimeEpochSeconds) {
        this.token = token;
        this.id = id;
        this.isAdmin = isAdmin;
        this.expiryTimeEpochSeconds = expiryTimeEpochSeconds;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public long getExpiryTimeEpochSeconds() {
        return expiryTimeEpochSeconds;
    }
}
