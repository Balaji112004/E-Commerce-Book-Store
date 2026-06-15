package com.signuplogin.demo.controllers;

import com.signuplogin.demo.DTO.FeedbackRequest;
import com.signuplogin.demo.entity.*;
import com.signuplogin.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})

@RestController
@RequestMapping("/api")
public class controllerr {

    @Autowired
    private signuprepo signrepo;
    @Autowired
    private CartRepository cartRepo;
    @Autowired
    private productrepo productrepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private FeedbackRepository feedbackRepo;

    // -------------------- USER --------------------
    @PostMapping("/user/login")
    public Signup login(@RequestBody login loginReq) {
        return signrepo.findByMobileAndPassword(loginReq.getMobile(), loginReq.getPassword());
    }

    @PostMapping("/user/signup")
    public Signup signup(@RequestBody Signup s) {
        return signrepo.save(s);
    }

    // -------------------- PRODUCTS --------------------
    @GetMapping("/trending")
    public List<Product> trendingBooks() {
        return productrepo.findByTrending(true);
    }

    @GetMapping("/category/{category}")
    public List<Product> getBooksByCategory(@PathVariable String category) {
        return productrepo.findByCategory(category);
    }

    @GetMapping("/fullBooks")
    public List<Product> full() {
        return productrepo.findAll();
    }

    // -------------------- CART --------------------
    @PostMapping("/cart")
    public Cart addToCart(@RequestBody CartRequest request) {
        Signup user = signrepo.findById(request.getUserId()).orElseThrow();
        Product product = productrepo.findById(request.getProductId()).orElseThrow();

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(request.getQuantity());

        return cartRepo.save(cart);
    }

    @GetMapping("/cart/{userId}")
    public List<CartResponse> getCartItemsByUser(@PathVariable int userId) {
        List<Cart> carts = cartRepo.findByUserId(userId);

        return carts.stream()
                .map(cart -> new CartResponse(
                        cart.getProduct().getId(),
                        cart.getProduct().getTitle(),
                        cart.getProduct().getNewPrice(),
                        cart.getQuantity(),
                        cart.getProduct().getCoverImage()
                ))
                .toList();
    }

    @DeleteMapping("/cartDeleteByProduct/{productId}")
    public ResponseEntity<String> deleteCartItemByProduct(@PathVariable int productId) {
        cartRepo.deleteByProductIdCustom(productId);
        return ResponseEntity.ok("Deleted cart items for product ID: " + productId);
    }

    @DeleteMapping("/cart/{userId}/product/{productId}")
    public ResponseEntity<?> deleteCartItemByUserAndProduct(
            @PathVariable int userId,
            @PathVariable int productId) {
        cartRepo.deleteByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }
    // -------------------- ORDERS --------------------
    @GetMapping("/orders/{userId}")
    public List<Order> getUserOrders(@PathVariable int userId) {
        return orderRepo.findByUserIdAndStatus(userId, "PAID");
    }

    @GetMapping("/orders")
    public List<Order> getOrders() {

        return orderRepo.findAll();
    }

    @GetMapping("/search/books/{search}")
    public List<Product> booksearch(@PathVariable String search) {
        return productrepo.booksearch(search);
    }

    @PostMapping("/feedback/{userId}")
    public Feedback submitFeedback(
            @PathVariable int userId,
            @RequestBody FeedbackRequest request
    ) {
        Signup user = signrepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setMessage(request.getMessage());

        return feedbackRepo.save(feedback);
    }


}

