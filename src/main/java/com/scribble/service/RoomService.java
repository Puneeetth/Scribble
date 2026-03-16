package com.scribble.service;

import com.scribble.dto.request.CreateRoomRequest;
import com.scribble.dto.response.RoomResponse;
import com.scribble.game.GameRoomManager;
import com.scribble.model.Room;
import com.scribble.model.RoomPlayer;
import com.scribble.model.User;
import com.scribble.repository.RoomPlayerRepository;
import com.scribble.repository.RoomRepository;
import com.scribble.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final GameRoomManager gameRoomManager;

    public RoomResponse createRoom(CreateRoomRequest request){
        String roomCode = generateRoomCode();
        User user = new User();
        user.setUserName(request.getUserName());
        user = userRepository.save(user);

        Room room = new Room();
        room.setRoomCode(roomCode);
        room = roomRepository.save(room);

        RoomPlayer roomPlayer = new RoomPlayer();
        roomPlayer.setRoom(room);
        roomPlayer.setUser(user);
        roomPlayer.setIsHost(true);

        roomPlayerRepository.save(roomPlayer);

    }


    private String generateRoomCode(){
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for(int i = 0;i < 6;i++){
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
return code.toString();
    }
}
