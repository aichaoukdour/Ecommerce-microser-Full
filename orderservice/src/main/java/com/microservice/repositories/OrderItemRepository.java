package com.microservice.repositories;

import com.microservice.entities.Order;
import com.microservice.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    void deleteByOrderId(Long orderId);

}


    // Vous pouvez ajouter d'autres méthodes de recherche selon vos besoins
