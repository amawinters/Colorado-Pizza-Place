package com.coloradopizza;

import java.util.List;

public class OrderCalculator {
    public static final double TAX_RATE = 0.0825;
    public static final double DELIVERY_FEE = 3.99;

    public double subtotal(List<CartItem> items) {
        return items.stream().mapToDouble(CartItem::total).sum();
    }

    public double tax(double subtotal) {
        return subtotal * TAX_RATE;
    }

    public double total(double subtotal, boolean delivery) {
        return subtotal + tax(subtotal) + (delivery ? DELIVERY_FEE : 0);
    }
}
