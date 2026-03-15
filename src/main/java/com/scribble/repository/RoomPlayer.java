package com.scribble.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomPlayer extends JpaRepository<RoomPlayer,Long> {
    Optional<com.scribble.model.RoomPlayer> findByRoomId(Long roomId);

}
