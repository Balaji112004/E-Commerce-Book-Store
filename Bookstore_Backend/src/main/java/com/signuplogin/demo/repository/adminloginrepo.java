package com.signuplogin.demo.repository;

import com.signuplogin.demo.entity.Adminlogin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface adminloginrepo extends JpaRepository<Adminlogin,Integer> {
      Adminlogin findByNameAndPassword(String name,String password);
}
