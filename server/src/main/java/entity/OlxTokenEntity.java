package entity;


import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "olx_credentials")
public class OlxTokenEntity extends PanacheEntityBase {

    @Id
    public String id = "SINGLETON";

    @Column(length = 2048)
    public String refreshToken;

    public Instant updatedAt;
}
