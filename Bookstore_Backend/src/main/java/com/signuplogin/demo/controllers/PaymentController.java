
package com.signuplogin.demo.controllers;

import com.signuplogin.demo.entity.*;
import com.signuplogin.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/orders")
public class PaymentController {

    @Autowired
    private signuprepo signrepo;
    @Autowired
    private CartRepository cartRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private OrderItemRepository orderItemRepo;

    // Read credentials from environment variables (never hardcode in production)
    private final String CLIENT_ID;
    private final String CLIENT_SECRET;
    private static final String CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg"; // Switch to "https://api.cashfree.com/pg" for production

    public PaymentController() {
        CLIENT_ID = System.getenv().getOrDefault(
               
        );
        CLIENT_SECRET = System.getenv().getOrDefault(
               
        );
    }

    // -------------------- PLACE ORDER --------------------
    @PostMapping("/place/{userId}")
    public ResponseEntity<?> placeOrder(@PathVariable int userId) {
        Optional<Signup> optionalUser = signrepo.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "User not found"));
        }
        Signup user = optionalUser.get();

        List<Cart> cartItems = cartRepo.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "Cart is empty"));
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getNewPrice() * item.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepo.save(order);

        for (Cart cart : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cart.getProduct());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(cart.getProduct().getNewPrice());
            orderItemRepo.save(orderItem);
        }

        return ResponseEntity.ok(savedOrder);
    }

    // -------------------- CREATE CASHFREE PAYMENT ORDER --------------------
    @PostMapping("/payment/{userId}/{orderId}")
    public ResponseEntity<Map<String, Object>> createCashfreeOrder(
            @PathVariable int userId,
            @PathVariable int orderId,
            @RequestBody Map<String, Object> request
    ) {
        try {
            String orderAmountStr = Objects.toString(request.get("orderAmount"), null);
            if (orderAmountStr == null) {
                return ResponseEntity.status(400).body(Map.of("error", "Missing order amount"));
            }

            double orderAmount = Double.parseDouble(orderAmountStr);
            if (orderAmount <= 0) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid order amount"));
            }

            String customerEmail  = Objects.toString(request.getOrDefault("customerEmail",  "guest@example.com"));
            String customerPhone  = Objects.toString(request.getOrDefault("customerPhone",  "9999999999"));
            String customerName   = Objects.toString(request.getOrDefault("customerName",   "Guest User"));

            String cashfreeOrderId = String.valueOf(orderId);

            Map<String, Object> payload = new HashMap<>();
            payload.put("order_id",       cashfreeOrderId);
            payload.put("order_amount",   orderAmount);
            payload.put("order_currency", "INR");

            Map<String, Object> orderMeta = new HashMap<>();
            orderMeta.put("return_url",
                    "http://localhost:5173/payment-success?orderId=" + orderId);
            payload.put("order_meta", orderMeta);

            Map<String, String> customer = new HashMap<>();
            customer.put("customer_id",    "CUST_" + userId);
            customer.put("customer_email", customerEmail);
            customer.put("customer_phone", customerPhone);
            customer.put("customer_name",  customerName);
            payload.put("customer_details", customer);

            HttpHeaders headers = buildCashfreeHeaders();

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    CASHFREE_BASE_URL + "/orders",
                    entity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return ResponseEntity.status(500).body(Map.of("error", "Invalid response from Cashfree"));
            }

            Map<String, Object> cfResponse = response.getBody();
            String paymentSessionId = (String) cfResponse.get("payment_session_id");

            if (paymentSessionId == null) {
                return ResponseEntity.status(500).body(Map.of("error", "No payment session returned"));
            }

            return ResponseEntity.ok(Map.of(
                    "paymentSessionId", paymentSessionId,
                    "orderId",          cashfreeOrderId
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Exception: " + e.getMessage()));
        }
    }

    // -------------------- VERIFY PAYMENT (Real Cashfree Check) --------------------
    @PostMapping("/verify/{orderId}")
    @Transactional
    public ResponseEntity<?> verifyPayment(@PathVariable int orderId) {
        try {
            // 1. Fetch order from DB
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            // Avoid re-processing an already verified order
            if ("PAID".equals(order.getStatus())) {
                return ResponseEntity.ok(Map.of(
                        "success",       true,
                        "message",       "Order already verified and paid.",
                        "orderId",       orderId,
                        "amount",        order.getTotalAmount(),
                        "paymentMethod", "N/A"
                ));
            }

            // 2. Call Cashfree to get the list of payments for this order
            HttpHeaders headers = buildCashfreeHeaders();
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<List> cfResponse = restTemplate.exchange(
                    CASHFREE_BASE_URL + "/orders/" + orderId + "/payments",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    List.class
            );

            if (!cfResponse.getStatusCode().is2xxSuccessful() || cfResponse.getBody() == null) {
                return ResponseEntity.status(502).body(Map.of(
                        "success", false,
                        "message", "Could not fetch payment info from Cashfree."
                ));
            }

            List<Map<String, Object>> payments = cfResponse.getBody();

            if (payments == null || payments.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of(
                        "success", false,
                        "message", "No payments found for this order."
                ));
            }

            // 3. Check if any payment has SUCCESS status
            //    Cashfree returns payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED"
            Map<String, Object> successfulPayment = payments.stream()
                    .filter(p -> "SUCCESS".equalsIgnoreCase(
                            Objects.toString(p.get("payment_status"), "")))
                    .findFirst()
                    .orElse(null);

            if (successfulPayment == null) {
                // Check if still pending
                boolean hasPending = payments.stream()
                        .anyMatch(p -> "PENDING".equalsIgnoreCase(
                                Objects.toString(p.get("payment_status"), "")));

                String msg = hasPending
                        ? "Payment is still pending. Please wait."
                        : "Payment was not successful. Please try again.";

                return ResponseEntity.status(400).body(Map.of(
                        "success", false,
                        "message", msg
                ));
            }

            // 4. Payment is verified — extract useful details
            String paymentMethod  = extractPaymentMethod(successfulPayment);
            Object paymentAmount  = successfulPayment.getOrDefault("payment_amount",
                    order.getTotalAmount());

            // 5. Mark order as PAID in DB
            order.setStatus("PAID");
            orderRepo.save(order);

            // 6. Clear the user's cart
            Signup user = order.getUser();
            if (user != null) {
                cartRepo.deleteByUser(user);
            }

            return ResponseEntity.ok(Map.of(
                    "success",       true,
                    "message",       "Payment verified successfully! Your order has been confirmed.",
                    "orderId",       orderId,
                    "amount",        paymentAmount,
                    "paymentMethod", paymentMethod
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Payment verification error: " + e.getMessage()
            ));
        }
    }

    // -------------------- HELPER: Build Cashfree Headers --------------------
    private HttpHeaders buildCashfreeHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("x-client-id",     CLIENT_ID);
        headers.set("x-client-secret", CLIENT_SECRET);
        headers.set("x-api-version",   "2022-09-01");
        return headers;
    }

    // -------------------- HELPER: Extract Payment Method --------------------
    private String extractPaymentMethod(Map<String, Object> payment) {
        try {
            // Cashfree nests method info under "payment_method" object
            Object methodObj = payment.get("payment_method");
            if (methodObj instanceof Map) {
                Map<String, Object> methodMap = (Map<String, Object>) methodObj;
                // The key is the method type: "upi", "card", "netbanking", "wallet", etc.
                if (methodMap.containsKey("upi"))        return "UPI";
                if (methodMap.containsKey("card"))       return "Card";
                if (methodMap.containsKey("netbanking")) return "Net Banking";
                if (methodMap.containsKey("wallet"))     return "Wallet";
                if (methodMap.containsKey("emi"))        return "EMI";
                if (methodMap.containsKey("paylater"))   return "Pay Later";
            }
        } catch (Exception ignored) {}
        return "Online Payment";
    }
}
