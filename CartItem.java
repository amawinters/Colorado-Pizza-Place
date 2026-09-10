package com.coloradopizza;

import java.util.List;

public record CartItem(String pizzaName, String size, List<String> toppings, double unitPrice, int quantity) {
    public double total() {
        return unitPrice * quantity;
    }
}
