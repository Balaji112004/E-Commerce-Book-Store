package com.signuplogin.demo.controllers;

import com.signuplogin.demo.entity.*;
import com.signuplogin.demo.repository.*;
import java.sql.Timestamp;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.signuplogin.demo.jwt.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173/","http://localhost:5174/"})
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private signuprepo signrepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private adminloginrepo adminRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private productrepo productrepo;


    @PostMapping("/login")
    public ResponseEntity<?> adminlogincheck(@RequestBody Adminlogin loginData) {

        Adminlogin admin = adminRepo.findByNameAndPassword(loginData.getName(), loginData.getPassword());

        if (admin == null) {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }

        String name=admin.getName();
        String token = jwtUtil.generateToken(admin.getName());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "admin", name
        ));
    }

    @GetMapping("dashboard/details")
    public ResponseEntity<?> Admindashboarddetails(){
        long Books=productrepo.getProductCount();
        long User=signrepo.getUserCount();
        int Orders= orderRepo.NoOfOrders();
        long Amount=orderRepo.getAmount();


        return ResponseEntity.ok(Map.of(
                "Books",Books,
                "Users", User,
                "Orders",Orders,
                "Amount",Amount
                )

        );
    }

    @GetMapping("monthwise/salary/{month}/{year}")
    public Integer getMonthwiseSalary(@PathVariable int month, @PathVariable int year){
        return orderRepo.getTotalAmountByMonth(month, year);
    }

    @GetMapping("/order/details")
    public List<OrderResponse> getAllOrders() {
        List<Map<String, Object>> rows = orderRepo.getOrdersWithUser();

        List<OrderResponse> list = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            OrderResponse res = new OrderResponse();
            res.setOrderId((Integer) row.get("order_id"));
            res.setTotalAmount(((Double) row.get("total_amount")).intValue());

            res.setStatus((String) row.get("status"));

            Timestamp ts = (Timestamp) row.get("order_date");
            res.setOrderDate(ts != null ? ts.toLocalDateTime() : null);

            res.setUserName((String) row.get("user_name"));

            // fetch items
            List<OrderItem> items = orderItemRepo.getItems(res.getOrderId());
            res.setItems(items);

            list.add(res);
        }
        return list;
    }

    @GetMapping("users/details")
    public List<UserDetails> userDetails() {
        List<Signup> users = signrepo.findAll();  // fetch all Signup entities
        List<UserDetails> sendData = new ArrayList<>();

        for (Signup user : users) {
            UserDetails details = new UserDetails();
            details.setId(user.getId());
            details.setName(user.getName());
            details.setMobile(user.getMobile());
            details.setEmail(user.getEmail());
            details.setAddress(user.getAddress());
            sendData.add(details);
        }

        return sendData;
    }



    @GetMapping("/fullBooks")
    public List<Product> full() {
        return productrepo.findAll();
    }

    @PostMapping("/product")
    public Product addBook(@RequestBody Product product){
        return productrepo.save(product);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<Product> updateBook(@PathVariable int id, @RequestBody Product newProd) {
        return productrepo.findById(id)
                .map(p -> {
                    p.setTitle(newProd.getTitle());
                    p.setDescription(newProd.getDescription());
                    p.setOldPrice(newProd.getOldPrice());
                    p.setNewPrice(newProd.getNewPrice());
                    p.setCategory(newProd.getCategory());
                    p.setCoverImage(newProd.getCoverImage());
                    p.setTrending(newProd.isTrending());
                    return ResponseEntity.ok(productrepo.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable int id) {
        productrepo.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully");
    }

}
