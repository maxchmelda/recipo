This project is going to be a fullstack js app named 'recipo'

It will basically be an online recipe book.

A user is going to be able to:
    -register/login
    -search for recipes
    -find recipes using filters and sorting
    -create/edit/delete recipes
    -save other's recipes to their cookbook
    -add a review on other's recipes
    -enter a cooking mode on a recipe
        *adjust servings number for the recipe
        *complete the cooking



recipe_schema {
    steps: [
        { step: 1, 
          directions: 'some text'
        },
        { step: 2, 
          directions: 'some text'
        }
    ],
    ingredients: [
        { ingredient: 'apple', amount: 300, unit: 'mug' }
    ],
    tags: [ 'High protein', 'Low carb', 'Vegetarian', 'Chicken'],
    author: { name: 'Martin Happy', id: 839482589348 },
    times: { total: 3.23, prep: 1, cook: 2.46 },    //(in hours, number)
    reviews: [
        {
            user: { name: 'Adam', id: 39085480395 },
            stars: 3,   // Out of 5
            text: 'Very good recipe...',
            date: '03.11.2024'
        }
    ],
    description: 'some description...',
    cooked_by: [ id, id, id, id ],
    recipe_id: 2340239840982
}


User schema {
    email: 'gmail@gmail.com',
    password: 'hashedPassword'
    name: 'Joe Biden',
    pfp: profilePicture,
    savedRecipes: [ id, id, id, id ]
}