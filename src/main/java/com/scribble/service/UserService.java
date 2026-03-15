package com.scribble.service;

import com.scribble.model.User;
import com.scribble.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public Optional<User> findByUserName(String userName){
        return userRepository.findByUserName(userName);
    }
}
