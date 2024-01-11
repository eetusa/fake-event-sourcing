export class AddProductToCart {
    name;
    constructor(name) {
        this.name = name;
    }   


}

export class RemoveProductFromCart {
    name;
    constructor(name) {
        this.name = name;
    } 


}

export class MakeOrderFromCart {
    products;
    constructor(products) {
        this.products = products;
    } 


}