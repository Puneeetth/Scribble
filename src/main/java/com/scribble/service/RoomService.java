package com.scribble.service;

import com.scribble.dto.request.CreateRoomRequest;
import com.scribble.dto.request.JoinRoomRequest;
import com.scribble.dto.response.PlayerResponse;
import com.scribble.dto.response.RoomResponse;
import com.scribble.exception.RoomNotFoundException;
import com.scribble.game.GameRoomManager;
import com.scribble.model.Room;
import com.scribble.model.RoomPlayer;
import com.scribble.model.User;
import com.scribble.repository.RoomPlayerRepository;
import com.scribble.repository.RoomRepository;
import com.scribble.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final GameRoomManager gameRoomManager;

    //Initialising the room for the players to join
    public RoomResponse createRoom(CreateRoomRequest request){
        String roomCode = generateRoomCode();
//        User user = new User();
//        user.setUserName(request.getUserName());
//        user.setTotalScore(0);
//        user = userRepository.save(user);
        User user = userRepository.findByUserName(request.getUserName())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName(request.getUserName());
                    newUser.setTotalScore(0);
                    return userRepository.save(newUser);
                });

        Room room = new Room();
        room.setRoomCode(roomCode);
        room = roomRepository.save(room);

        RoomPlayer roomPlayer = new RoomPlayer();
        roomPlayer.setRoom(room);
        roomPlayer.setUser(user);
        roomPlayer.setIsHost(true);

        roomPlayerRepository.save(roomPlayer);
       gameRoomManager.createRoom(roomCode);

       return buildRoomResponse(room);
    }
    //logic to join the room
    public RoomResponse joinRoom(JoinRoomRequest request){
        Room room = roomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() -> new RoomNotFoundException(request.getRoomCode()));

//        User user = new User();
//        user.setUserName(request.getUserName());
//        user.setTotalScore(0);
//        user = userRepository.save(user);
        User user = userRepository.findByUserName(request.getUserName())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName(request.getUserName());
                    newUser.setTotalScore(0);
                    return userRepository.save(newUser);
                });

        RoomPlayer roomPlayer = new RoomPlayer();
        roomPlayer.setRoom(room);
        roomPlayer.setUser(user);
        roomPlayer.setIsHost(false);

        roomPlayerRepository.save(roomPlayer);

        return buildRoomResponse(room);
    }

//Room Response after players join the room
    private RoomResponse buildRoomResponse(Room room) {

        List<PlayerResponse> players = roomPlayerRepository.findByRoomId(room.getId())
                .stream()
                .map(rp -> new PlayerResponse(
                        rp.getUser().getUserName(),
                        rp.getScore(),
                        rp.getIsHost()))
                .collect(Collectors.toList());

        return new RoomResponse(
                room.getRoomCode(),
                room.getStatus().name(),
                players
        );
    }

//Generate random room code with String of Characters
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
