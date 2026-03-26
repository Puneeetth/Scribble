package com.scribble.repository;

import com.scribble.model.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomPlayerRepository extends JpaRepository<RoomPlayer,Long> {
     List<RoomPlayer> findByRoomId(Long roomId);
}
