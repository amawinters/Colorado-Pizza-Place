package com.coloradopizza;

import java.util.List;

public class MenuService {
    private static final List<String> MEAT_TOPPINGS = List.of(
            "Pepperoni","Sausage","Canadian Bacon","Bacon","Grilled Chicken","Beef"
    );

    private static final List<String> VEGGIE_TOPPINGS = List.of(
            "Mushrooms","Onions","Pineapple","Black Olives","Jalapeno Peppers","Banana Peppers",
            "Green Peppers","Fresh Spinach","Tomatoes"
    );

    private static final List<String> CHEESE_TOPPINGS = List.of(
            "Extra Cheese","Three Cheese Blend","Parmesan Cheese"
    );

    public static List<String> getMeatToppings() {
        return MEAT_TOPPINGS;
    }

    public static List<String> getVeggieToppings() {
        return VEGGIE_TOPPINGS;
    }

    public static List<String> getCheeseToppings() {
        return CHEESE_TOPPINGS;
    }

    private final List<Pizza> pizzas = List.of(
        new Pizza(1, "Cheese Pizza", "Cheese and pizza sauce on your choice of crust.", 10.99, List.of()),
        new Pizza(2, "Pepperoni Pizza", "Pepperoni, cheese, and pizza sauce on your choice of crust.", 12.99, List.of()),
        new Pizza(3, "Meat Lovers", "Pepperoni, sausage, beef, Canadian bacon, and bacon. This includes pizza sauce and cheese on your choice of crust.", 14.99, List.of()),
        new Pizza(4, "Veggie Supreme", "Green peppers, onions, mushrooms, black olives, and tomatoes. This includes pizza sauce and cheese on your choice of crust.", 13.49, List.of())
    );

    public List<Pizza> getPizzas() {

        return pizzas;
    }

    public Pizza findById(int id) {

        return pizzas.stream()
                .filter(p -> p.id() == id)
                .findFirst()
                .orElse(null);
    }
}
