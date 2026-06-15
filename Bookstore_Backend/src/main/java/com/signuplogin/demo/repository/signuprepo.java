package com.signuplogin.demo.repository;

import com.signuplogin.demo.entity.Signup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface signuprepo extends JpaRepository<Signup,Integer> {
    Signup findByMobileAndPassword(String mobile,String password);

    @Query(value="SELECT count(*) from signup",nativeQuery = true)
    long getUserCount();
}
