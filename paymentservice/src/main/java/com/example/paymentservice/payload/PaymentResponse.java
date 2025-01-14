package com.example.paymentservice.payload;


import com.example.paymentservice.utils.PaymentMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponse {
    private long paymentId;
    private String status;
    private PaymentMode paymentMode;
    private long totalPrice;
    private Instant paymentDate;
    private long orderId;
    
  
}
