import { useEffect, useState } from "react";
import React from 'react'
import { AddProductToCart, MakeOrderFromCart, RemoveProductFromCart } from "./ShoppingCartCommands";
import { OrderMadeFromCart, ProductAddedToCart, ProductRemovedFromCart } from "./ShoppingCartEvent";

const ShoppingCart = () => {
    const [events, setEvents] = useState([]);
    const [order, setOrder] = useState(() => new Map());
    const [page, setPage] = useState(0);
    const [buttonLabel, setButtonLabel] = useState("Tee tilaus");

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        let keys = [];
        for (let keyValuePair of order) {
            let key = keyValuePair[0];
            let value = keyValuePair[1];
            if (value) {
                keys.push(key);
            }
        }
        setOrderList(keys);
    }, [order])


    const handleOrder = () => {
        let value = page + 1;
        setPage(value);
        if (value === 0) {
            setButtonLabel("Tee tilaus")
        } else if (value % 3 === 1) {
            setButtonLabel("Näytä eventit")
        } else if (value % 3 === 2) {
            setButtonLabel("Palaa")
        } else if (value % 3 === 0) {
            setButtonLabel("'CRUD' versio")
        }
    }

    const handleEvent = (event) => {
        let tempMapOrder = new Map(order)
        let tempEvents = [...events]

        if (page ===  0) {

            if (event instanceof AddProductToCart) {
                console.log("AddProductToCart(" + event.name+")")
                tempMapOrder.set(event.name, true)
                tempEvents.push(new ProductAddedToCart(event.name))
            }
            if (event instanceof RemoveProductFromCart) {
                console.log("RemoveProductFromCart(" + event.name+")")
                tempMapOrder.set(event.name, false)
                tempEvents.push(new ProductRemovedFromCart(event.name))
            }
            setEvents(tempEvents)
            setOrder(tempMapOrder)
        }

        if (event instanceof MakeOrderFromCart) {
            if (page === 0){
                console.log("OrderMadeFromCart()")
                tempEvents.push(new OrderMadeFromCart(order))
            }
            handleOrder()
        }
    }

    const products = ["Mozzarella", "Pepperooni", "Ananas", "Paprika", "Kesäkurpitsa", "Tonnikala", "Jauheliha", "Kebab", "Valkosipulidippi"]
    return (
        <div style={{width: "100%"}}>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px double rgb(100, 10, 10)"}}>
                <h1 style={{marginLeft: "30px"}}>Pizzakauppa.com</h1>
                <button style={{marginRight: "30px", marginTop: "30px", height: "50px"}} onClick={() => handleEvent(new MakeOrderFromCart(order))}>
                    {buttonLabel}
                </button>
            </div>

            <div style={{"display": "flex", "width": "100%", borderBottom: "3px double rgb(200, 10, 10)", paddingBottom: "10px", marginBottom: "10px"}}>
                {page % 3 === 0 &&
                    <div style={{"marginLeft": "40px", "width": "50%","display": "flex", "flexDirection" : "column", "justifyContent": "flex-start", "alignItems": "flex-start"}}>
                        {products.map(p => 
                                    <Checkbox
                                        key = {p + p}
                                        label = {p}
                                        handleEvent = {handleEvent}
                                        order = {order}
                                    />
                        )}
                    </div>
                }
                {page % 3 === 1 &&
                    <div style={{"width": "50%", paddingLeft: "30px", fontSize: "20px"}}>
                        {events[events.length-1].toString()}
                        <table style={{textAlign: "right", fontSize: "20px"}}>
                            <tbody>
                                <tr>
                                    <th>row id</th>
                                    <th>cart id</th>
                                    {products.map(((p, index) => 
                                        <th key={p + index}>
                                            {p}
                                        </th>
                                    ))}
                                </tr>
                                <tr >
                                        <td>0</td>
                                        <td>pizzanTilaaja02</td>
                                {products.map((product, index) => {
                                    return (
                                            <td key={index + product + "xyz"}>{orderList.includes(product) ? "true" : "false"}</td>
                                    )
                                })}
                                </tr>

                            </tbody>
                        </table>
                    </div>
                }
                {page % 3 === 2 &&
                    <div style={{"width": "100%", paddingLeft: "30px"}}>
                        <EventPrint events={events}/>
                    </div>
                }
                {page % 3 === 0 &&
                    <Order
                        products={order}
                    />
                }

        </div>
      </div>

    );
}

const EventPrint = ({ events }) => {
    return (
        <div>
                Event journal
                <table style={{textAlign: "right"}}>
                    <tbody>
                        <tr>
                            <th>event id</th>
                            <th>cart id</th>
                            <th>event</th>
                        </tr>
                        {events.map((event, index) => {
                            return (
                                <tr key={index + "tr"}>
                                    <td key={index + "td1"}>{index}</td>
                                    <td key={index + "td2"}>pizzanTilaaja02</td>
                                    <td style={event instanceof ProductRemovedFromCart ? {color: "#d31e1e"} : {}} key={index + "td3"}>
                                        {event.toString()}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
        </div>
      );
}

const Checkbox = ({ label, handleEvent, order }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const isProductInMap = (label) => {
            if (!order.has(label)) {
                return false;
            }
            return order.get(label);
        }
    
        setChecked(isProductInMap(label))
    }, [label, order])


    return (
      <label style={checked ? {color: "#7eff5d"} : {color: "#fff"}}>
        <input 
            
            type="checkbox"
            checked={checked}
            onChange={() => checked ? handleEvent(new RemoveProductFromCart(label)) : handleEvent(new AddProductToCart(label))}
        ></input>
        {label}
      </label>
    );
  };

  const Order = ({ products }) => {
    const [orderList, setOrderList] = useState([]);
    const [price, setPrice] = useState(8);
    useEffect(() => {
        let keys = [];
        for (let keyValuePair of products) {
            let key = keyValuePair[0];
            let value = keyValuePair[1];
            if (value) {
                keys.push(key);
            }
        }
        setPrice(8 + keys.length * 1.5)
        setOrderList(keys);
    }, [products])
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <div>
                Tilaus:
                <ul style={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
                    {orderList.map((product) =>
                    <li style={{listStyleType: "none"}} key={product}>
                        {product}
                    </li>
                    )}
                </ul>
            </div>
            <p className="price">Hinta: {price} €</p>
        </div>
    );
  };

export default ShoppingCart;