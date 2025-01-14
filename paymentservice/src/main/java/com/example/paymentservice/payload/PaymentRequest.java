package com.example.paymentservice.payload;



import com.example.paymentservice.utils.PaymentMode;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentRequest {
    private long orderId;

   
    private long totalPrice;

    private PaymentMode paymentMode;
    
}

