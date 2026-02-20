package com.scribble.model;

import com.scribble.enums.RoomStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String roomCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "room")
    private List<RoomPlayer> roomPlayers;

    @OneToMany(mappedBy = "room")
    private List<Round> rounds;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = RoomStatus.WAITING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Room() {
    }

    public Room(String roomCode) {
        this.roomCode = roomCode;
        this.status = RoomStatus.WAITING;
    }

    public Long getId() {
        return id;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<RoomPlayer> getRoomPlayers() {
        return roomPlayers;
    }

    public List<Round> getRounds() {
        return rounds;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }
}