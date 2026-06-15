package com.signuplogin.demo.repository;


import com.signuplogin.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserId(int userId);
    List<Order> findByUserIdAndStatus(int userId, String status);

    @Query(value="SELECT count(*) from orders where status='PAID'",nativeQuery = true)
    int NoOfOrders();

    @Query(value="SELECT SUM(total_amount) FROM orders WHERE status='PAID'",nativeQuery = true)
    int getAmount();

    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
            "WHERE MONTH(o.orderDate) = :month " +
            "AND YEAR(o.orderDate) = :year " +
            "AND o.status = 'PAID'")
    Integer getTotalAmountByMonth(@Param("month") int month, @Param("year") int year);

    @Query(
            value = "SELECT o.id AS order_id, o.total_amount, o.order_date, o.status, s.name AS user_name " +
                    "FROM orders o JOIN signup s ON o.user_id = s.id " +
                    "WHERE o.status = 'PAID' " +
                    "ORDER BY o.order_date DESC",
            nativeQuery = true
    )

    List<Map<String, Object>> getOrdersWithUser();


}
