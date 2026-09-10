package com.coloradopizza;

import java.util.List;

public record Pizza(int id, String name, String description, double basePrice, List<String> toppings) {}
