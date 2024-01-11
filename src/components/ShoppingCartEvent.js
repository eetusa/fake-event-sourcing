export class ProductAddedToCart {
    name;
    constructor(name) {
        this.name = name;
    }   

    toString() {
        return "Lisätty koriin: " + this.name
    }
}

export class ProductRemovedFromCart {
    name;
    constructor(name) {
        this.name = name;
    }   

    toString() {
        return "Poistettu korista: " + this.name
    }
}

export class OrderMadeFromCart {
    products;
    constructor(products) {
        this.products = products;
    }   

    toString() {
        let keys = [];

        for (let keyValuePair of this.products) {
            let key = keyValuePair[0];
            let value = keyValuePair[1];
            if (value) {
                keys.push(key);
            }
        }

        return "Tilattu pizza: " + keys;
    }
}