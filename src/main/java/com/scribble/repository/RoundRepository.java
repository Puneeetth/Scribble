package com.scribble.repository;

import com.scribble.model.Room;
import com.scribble.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoundRepository extends JpaRepository<Round,Long> {
    Optional<Room> findByRoomId(Long roomId);
}
