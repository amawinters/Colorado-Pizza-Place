package com.coloradopizza;

import java.util.List;

public class CartItemTest {
    public static void main(String[] args) {
        CartItem item = new CartItem("Pepperoni", "Large", List.of("Extra Cheese"), 15.99, 2);
        if (Math.abs(item.total() - 31.98) > 0.001) {
            throw new AssertionError("Cart total calculation failed.");
        }
        OrderCalculator calculator = new OrderCalculator();
        double total = calculator.total(31.98, true);
        if (Math.abs(total - 38.60835) > 0.001) {
            throw new AssertionError("Order total calculation failed.");
        }
        System.out.println("All calculation tests passed.");
    }
}
