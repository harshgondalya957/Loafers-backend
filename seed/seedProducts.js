const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });
const mongoose = require("mongoose");
const Product = require("../models/Product");

// We cannot directly `require` or `import` the frontend React 'products.js' file into Node.js 
// because it contains `.jpg` and `.png` static asset imports which cause Node.js to crash.
// Therefore, we reconstruct the exact `menuData` structure stringly for the seed script 
// without modifying the frontend data or paths.
const menuData = {
    "Hot Drinks": [
        { name: "Coffee", price: "3.95", image: "../assets/HotDrinks/c1.png" },
        { name: "Cappuccino", price: "3.95", image: "../assets/HotDrinks/c2.png" },
        { name: "Latte", price: "3.95", image: "../assets/HotDrinks/c3.png" },
        { name: "English Tea", price: "3.95", image: "../assets/HotDrinks/c4.png" },
        { name: "Green Tea", price: "3.95", image: "../assets/HotDrinks/c5.png" },
        { name: "Indian Masala Tea", price: "3.95", image: "../assets/HotDrinks/c6.png" },
        { name: "Peppermint Tea", price: "3.95", image: "../assets/HotDrinks/c7.png" },
        { name: "Ginger Tea", price: "3.95", image: "../assets/HotDrinks/c8.png" },
        { name: "Karak Chai", price: "3.95", image: "../assets/HotDrinks/c9.png" },
        { name: "Cadbury’s Hot Chocolate", price: "3.95", image: "../assets/HotDrinks/c10.png" },
        { name: "Hot Chocolate Heaven", price: "4.95", image: "../assets/HotDrinks/c11.png" }
    ],
    "Soft Drinks": [
        { name: "Coke 300ml", price: "1.99", image: "../assets/SoftDrinks/s1.png" },
        { name: "Diet Coke 300ml", price: "3.95", image: "../assets/SoftDrinks/s2.png" },
        { name: "Coke Zero 300ml", price: "1.99", image: "../assets/SoftDrinks/s3.png" },
        { name: "Fanta 300ml", price: "1.99", image: "../assets/SoftDrinks/s4.png" },
        { name: "Sprite 300ml", price: "1.99", image: "../assets/SoftDrinks/s5.png" },
        { name: "Dr. Pepper 300ml", price: "1.99", image: "../assets/SoftDrinks/s6.png" },
        { name: "Oasis Summer Fruits 300ml", price: "2.25", image: "../assets/SoftDrinks/s7.png" },
        { name: "Oasis Citrus Punch 300ml", price: "2.25", image: "../assets/SoftDrinks/s8.png" },
        { name: "Water 300ml", price: "2.00", image: "../assets/SoftDrinks/s9.png" },
        { name: "Monster Ultra", price: "3.50", image: "../assets/SoftDrinks/s10.png" }
    ],
    "Burger Bar": [
        { name: "Proper Beef Burger", price: "5.95", description: "1/4 Pounder beef burger...", image: "../assets/BurgerBar/b1.png", tags: ["Trending", "Most Ordered"] },
        { name: "1/4 Pound Veggie Burger", price: "5.95", description: "(Vegetarian)...", image: "../assets/BurgerBar/b2.png" },
        { name: "Beanie Burger", price: "5.95", description: "(Vegetarian)...", image: "../assets/BurgerBar/b3.png" },
        { name: "Plant Burger", price: "5.95", description: "(Vegetarian)...", image: "../assets/BurgerBar/b4.png" },
        { name: "Chicken Burger", price: "5.95", description: "A crispy chicken breast burger...", image: "../assets/BurgerBar/b5.png", tags: ["Most Ordered"] },
        { name: "Hot'n'Kicking chicken burger", price: "5.95", description: "A crispy fried spicy chicken breast burger...", image: "../assets/BurgerBar/b6.png" },
        { name: "1/4 Pound Cheese Burger", price: "4.95", description: "A proper beef burger...", image: "../assets/BurgerBar/b7.png" },
        { name: "Double 1/4 Pound Cheese Burger", price: "5.95", description: "A massive half pound burger...", image: "../assets/BurgerBar/b8.png" },
        { name: "1/4 Pound Egg Cheese Burger", price: "4.95", description: "A tasty beef patty...", image: "../assets/BurgerBar/b9.png" },
        { name: "1/4 Pound Mushroom Cheese Burger", price: "4.95", description: "A proper beef patty...", image: "../assets/BurgerBar/b10.png" },
        { name: "Loaded Beef Burger", price: "9.50", description: "A proper beef burger...", image: "../assets/BurgerBar/b11.png" },
        { name: "Loafers Monster Burger", price: "9.50", description: "3 Proper beef patties...", image: "../assets/BurgerBar/b12.png" },
        { name: "Burger Burrito", price: "7.90", description: "Our proper beef patty wrapped...", image: "../assets/BurgerBar/b13.png" },
        { name: "Chicken Burger Burrito", price: "7.90", description: "Our crispy fried chicken breast...", image: "../assets/BurgerBar/b14.png" },
        { name: "Hot & Spicy Chick-en Burger burrito", price: "7.90", description: "Our hot and spicy crispy...", image: "../assets/BurgerBar/b15.png" },
        { name: "Plant Burger Burrito", price: "7.90", description: "our tasty grilled plant burger...", image: "../assets/BurgerBar/b16.png" }
    ],
    "Big Foot Hot Dogs": [
        { name: "Classic Dog", price: "6.95", description: "A foot-long sausage...", image: "../assets/BigFootHotDogs/h1.png" },
        { name: "American Dog", price: "6.95", description: "A foot-long hot dog...", image: "../assets/BigFootHotDogs/h2.png" },
        { name: "Cheesy Dog", price: "8.50", description: "A delicious foot-long hot dog...", image: "../assets/BigFootHotDogs/h3.png" },
        { name: "Fully Loaded Dog", price: "9.50", description: "A foot-long hot dog...", image: "../assets/BigFootHotDogs/fully_loaded_dog.png" }
    ],
    "Salad Bar": [
        { name: "Salad Box", price: "6.95", description: "Try our filling salad boxes...", image: "../assets/SaladBar/sa1.png" }
    ],
    "Savouries": [
        { name: "Vegetable Samosa (4 Pieces)", price: "6.50", description: "(Vegetarian)", image: "../assets/Savouries/sv1.png" },
        { name: "Lamb Samosa (4 Pieces)", price: "6.50", description: "", image: "../assets/Savouries/sv2.png" },
        { name: "Chicken Samosa (4 Pieces)", price: "6.50", description: "", image: "../assets/Savouries/sv3.png" },
        { name: "Cheese And Potato Pie", price: "3.50", description: "(Vegetarian)...", image: "../assets/Savouries/sv4.png" },
        { name: "Meat & Potato Pie", price: "3.50", description: "A home made traditional...", image: "../assets/Savouries/sv5.png" }
    ],
    "Meal Deals": [
        { name: "Jacket Potato Deal Meal", price: "9.95", description: "Jacket potato, 2 toppings...", image: "../assets/MealDeals/m1.png" },
        { name: "Muffin Deal Meal", price: "9.95", description: "Any sandwich, crisps...", image: "../assets/MealDeals/m2.png" },
        { name: "Triple Toastie Deal Meal", price: "10.95", description: "Any toasted sandwich...", image: "../assets/MealDeals/m3.png" },
        { name: "Burgers Deal Meal", price: "11.95", description: "Any burger, chips...", image: "../assets/MealDeals/m4.png" },
        { name: "Omelette Deal Meal", price: "6.95", description: "A 3 egg omelette...", image: "../assets/MealDeals/m5.png" }
    ],
    "Shakes": [
        { name: "Traditional Vanilla Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh1.png" },
        { name: "Strawberry Jam Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh2.png" },
        { name: "Bounty Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh3.png" },
        { name: "Chocolate Brownie Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh4.png" },
        { name: "Cookies & Cream Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh5.png" },
        { name: "Crunchie Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh6.png" },
        { name: "Twix Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh7.png" },
        { name: "Oreo Cookie Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh8.png" },
        { name: "Kit Kat Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh9.png" },
        { name: "Maltesers Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh10.png" },
        { name: "Mars Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh11.png" },
        { name: "Snickers Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh12.png" },
        { name: "Jaffa Cake Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh13.png" },
        { name: "Raffaello Shake (16oz)", price: "7.50", image: "../assets/Shakes/sh14.png" },
        { name: "Ferrero Rocher Shake (16oz)", price: "7.50", image: "../assets/Shakes/sh15.png" },
        { name: "Apple Pie Cake Shake", price: "7.50", image: "../assets/Shakes/sh16.png" },
        { name: "Reese Peanut Butter Cup Shake (16oz)", price: "7.50", image: "../assets/Shakes/sh17.png" },
        { name: "Kinder Bueno Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh18.png" },
        { name: "Aero Mint Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh19.png" },
        { name: "Biscoff Shake (16oz)", price: "7.50", image: "../assets/Shakes/sh20.png" },
        { name: "White Chocolate Shake (16oz)", price: "6.95", image: "../assets/Shakes/sh21.png" }
    ],
    "Sweet Treats": [
        { name: "Chocolate Triple Fudge Cake Sundae", description: "A tall sundae...", price: "7.50", image: "../assets/SweetTreats/sw1.png" },
        { name: "Biscoff Sundae", description: "A triple layered sundae...", price: "7.50", image: "../assets/SweetTreats/sw2.png" },
        { name: "Malteaser Sundae", description: "A crunchy triple layered sundae...", price: "7.50", image: "../assets/SweetTreats/sw3.png" },
        { name: "Crunchie Sundae", description: "A crispy crunchy triple layered sundae...", price: "7.50", image: "../assets/SweetTreats/sw4.png" }
    ],
    "Omelettes": [
        { name: "Eggy Bread (2 Slices)", description: "2 slices of thick toastie bread...", price: "5.95", image: "../assets/Omelettes/omlette1.png" },
        { name: "Omelette Plain", description: "(Vegetarian)...", price: "5.95", image: "../assets/Omelettes/omlette2.png" },
        { name: "Cheese & Onion Omelette", description: "(Vegetarian)...", price: "7.50", image: "../assets/Omelettes/omlette3.png" },
        { name: "Cheese & Ham Omelette", price: "7.50", description: "", image: "../assets/Omelettes/omlette4.png" }
    ],
    "Indian Breakfast": [
        { name: "Desi Breakfast", description: "Includes a masala omelette...", price: "8.50", image: "../assets/IndianBreakfast/indian1.png" },
        { name: "Masala Eggy Bread", description: "2 slices of bread in special masala...", price: "6.50", image: "../assets/IndianBreakfast/indian2.png" },
        { name: "Masala Omelette Bun", description: "A tasty masala omelette...", price: "6.50", image: "../assets/IndianBreakfast/indian3.png" },
        { name: "Paratha Quesadillas", description: "A combination of masala beans...", price: "8.95", image: "../assets/IndianBreakfast/indian4.png" }
    ],
    "Triple Toasties": [
        { name: "Bombay Triple Toastie", description: "(Vegetarian) Seasoned potato...", price: "7.95", image: "../assets/TripleToasties/t1.png" },
        { name: "Say Paneer Triple Toastie", description: "(Vegetarian) Chilli paneer...", price: "7.95", image: "../assets/TripleToasties/t2.png" },
        { name: "Beanie Surprise Triple Toastie", description: "(Vegetarian) Baked beans...", price: "7.95", image: "../assets/TripleToasties/t3.png" },
        { name: "Kebabish Triple Toastie", description: "Skewered chicken kebab...", price: "7.95", image: "../assets/TripleToasties/t4.png" },
        { name: "The Club Triple Toastie", description: "Chicken mayo, bacon...", price: "7.95", image: "../assets/TripleToasties/t5.png" },
        { name: "Sizzling Frango Triple Toastie", description: "Spicy peri peri chicken...", price: "7.95", image: "../assets/TripleToasties/t6.png" },
        { name: "Tuna Mix Triple Toastie", description: "Tuna mayo blended...", price: "7.95", image: "../assets/TripleToasties/t7.png" },
        { name: "Kyber Pass Triple Toastie", description: "Chicken tikka masala...", price: "7.95", image: "../assets/TripleToasties/t8.png" },
        { name: "Big Breaky Triple Toastie", description: "A full breaky in 3 layers...", price: "7.95", image: "../assets/TripleToasties/t9.png" }
    ],
    "Burritos": [
        { name: "Bombay Burrito", description: "(Vegetarian) Seasoned potato...", price: "7.95", image: "../assets/Burritos/bu1.png" },
        { name: "Say Paneer Burrito", description: "(Vegetarian) Chilli paneer...", price: "7.95", image: "../assets/Burritos/bu2.png" },
        { name: "Beanie Surprise Burrito", description: "(Vegetarian) Baked beans...", price: "7.95", image: "../assets/Burritos/bu3.png" },
        { name: "Kebabish Burrito", description: "Skewered chicken kebab...", price: "7.95", image: "../assets/Burritos/bu4.png" },
        { name: "The Club Burrito", description: "Chicken mayo...", price: "7.95", image: "../assets/Burritos/bu5.png" },
        { name: "Sizzling Frango Burrito", description: "Spicy peri peri...", price: "7.95", image: "../assets/Burritos/bu6.png" },
        { name: "Tuna Mix Burrito", description: "Tuna mayo...", price: "7.95", image: "../assets/Burritos/bu7.png" },
        { name: "Kyber Pass Burrito", description: "Chicken tikka masala...", price: "7.95", image: "../assets/Burritos/bu8.png" },
        { name: "Big Breaky Burrito", description: "A full breaky burrito...", price: "7.95", image: "../assets/Burritos/bu9.png" },
        { name: "Regular Silly Sausage Burrito", description: "Sausage, mustard...", price: "7.95", image: "../assets/Burritos/bu10.png", subsection: "silly" },
        { name: "Vegetarian Silly Sausage Burrito", description: "Vegetarian sausage...", price: "7.95", image: "../assets/Burritos/bu11.png", subsection: "silly" }
    ],
    "Sandwiches": [
        { name: "Soft Muffin Sandwich", price: "4.95", image: "../assets/Sandwiches/sd1.png", description: "" },
        { name: "Wrap", price: "5.50", image: "../assets/Sandwiches/sd2.png", description: "" },
        { name: "White Sliced Sandwich", price: "4.50", image: "../assets/Sandwiches/sd3.png", subsection: "sliced", description: "" },
        { name: "Brown Sliced Sandwich", price: "4.50", image: "../assets/Sandwiches/sd4.png", subsection: "sliced", description: "" },
        { name: "White Soft Baton Sandwich", price: "4.50", image: "../assets/Sandwiches/sd5.png", subsection: "baton", description: "" },
        { name: "Brown Soft Baton Sandwich", price: "4.50", image: "../assets/Sandwiches/sd6.png", subsection: "baton", description: "" }
    ],
    "Jacket Potatoes": [
        { name: "1 Topping Jacket Potato", price: "4.95", image: "../assets/JacketPotatoes/j1.png", description: "" },
        { name: "2 Topping Jacket Potato", price: "5.95", image: "../assets/JacketPotatoes/j2.png", description: "" },
        { name: "3 Topping Jacket Potato", price: "6.95", image: "../assets/JacketPotatoes/j3.png", description: "" }
    ],
    "Chippy": [
        { name: "French fries", price: "4.00", description: "A portion of crisp french fries...", image: "../assets/Chippy/ch1.png" },
        { name: "Chip Butty", price: "3.95", description: "Crisp fried French fries...", image: "../assets/Chippy/ch2.png" },
        { name: "Chip Butty Special", price: "6.95", description: "Crisp fried french fries...", image: "../assets/Chippy/ch3.png" },
        { name: "Chilli Chips", price: "5.95", description: "Crispy fried french fries...", image: "../assets/Chippy/ch4.png" },
        { name: "Garlic Chilli Chips", price: "5.95", description: "Crispy fried french fries...", image: "../assets/Chippy/ch5.png" },
        { name: "Garlic Chilli Chip Butty Special", price: "6.95", description: "Our tasty garlic chilli...", image: "../assets/Chippy/ch6.png" },
        { name: "Chilli Chip Butty Special", price: "6.95", description: "Our delicious chilli french fries...", image: "../assets/Chippy/ch7.png" },
        { name: "Chip Chaat", price: "7.50", description: "Crispy fried fries...", image: "../assets/Chippy/ch8.png" }
    ],
    "Loaded French Fries": [
        { name: "1 Topping", price: "7.95", description: "Choice of one topping...", image: "../assets/LoadedFrenchFries/ch9.png" },
        { name: "2 Toppings", price: "5.95", description: "Choice of any two toppings...", image: "../assets/LoadedFrenchFries/ch10.png" },
        { name: "3 Toppings", price: "6.95", description: "Choice of any 3 toppings...", image: "../assets/LoadedFrenchFries/ch11.png" }
    ],
    "Loaded Chilli Or Garlic French Fries": [
        { name: "1 Topping", price: "5.50", description: "Choose any 1 topping.", image: "../assets/LoadedChilliGarlicFries/ch12.png" },
        { name: "2 Toppings", price: "6.50", description: "Choose any two toppings.", image: "../assets/LoadedChilliGarlicFries/ch13.png" },
        { name: "3 Toppings", price: "7.50", description: "Choose any 3 toppings.", image: "../assets/LoadedChilliGarlicFries/ch14.png" }
    ],
    "Breakfast": [
        { name: "1 Filling Breakfast", price: "4.75", image: "../assets/Breakfast/br1.png" },
        { name: "2 Filling Breakfast", price: "5.75", image: "../assets/Breakfast/br2.png" },
        { name: "3 Filling Breakfast", price: "6.75", image: "../assets/Breakfast/br3.png" },
        { name: "4 Filling Breakfast", price: "7.75", image: "../assets/Breakfast/br4.png" },
        { name: "Big Brunch Tray", description: "2 sausages, 2 fried eggs, 2 rashers...", price: "9.95", image: "../assets/Breakfast/br5.png" },
        { name: "Tea Big Veggie Breakfast Tray", price: "9.95", image: "../assets/Breakfast/br6.png", subsection: "veggie_tray" },
        { name: "Coffee Big Veggie Breakfast Tray", price: "9.95", image: "../assets/Breakfast/br7.png", subsection: "veggie_tray" },
        { name: "Tea Big English Breakfast Tray", price: "8.95", image: "../assets/Breakfast/br8.png", subsection: "english_tray" },
        { name: "Coffee Big English Breakfast Tray", price: "8.95", image: "../assets/Breakfast/br9.png", subsection: "english_tray" },
        { name: "White Toast", price: "3.50", image: "../assets/Breakfast/br10.png", subsection: "toast" },
        { name: "Brown Toast", price: "3.50", image: "../assets/Breakfast/br11.png", subsection: "toast" }
    ]
};

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "loafer" });
        console.log("MongoDB Connected");

        const products = [];

        for (const category in menuData) {
            for (const item of menuData[category]) {
                products.push({
                    name: item.name,
                    price: Number(item.price),
                    description: item.description || "",
                    image: item.image,
                    category: category,
                    subsection: item.subsection || null,
                    tags: item.tags || [],
                    isAvailable: true
                });
            }
        }

        await Product.deleteMany({});
        console.log("Old products deleted");

        await Product.insertMany(products);
        console.log("Products Seeded Successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error with seeding data:", error);
        process.exit(1);
    }
};

seedProducts();
