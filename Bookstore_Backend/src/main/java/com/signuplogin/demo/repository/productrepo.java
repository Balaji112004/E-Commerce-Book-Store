package com.signuplogin.demo.repository;

import com.signuplogin.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface productrepo extends JpaRepository<Product,Integer> {
    List<Product> findByTrending(boolean trending);
    List<Product> findByCategory(String category);

    @Query(value = "SELECT COUNT(*) FROM product", nativeQuery = true)
    long getProductCount();

    @Query(value = "SELECT * FROM product WHERE title LIKE %:search%", nativeQuery = true)
    List<Product> booksearch(String search);
}
