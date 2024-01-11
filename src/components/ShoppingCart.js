import { useEffect, useState } from "react";
import React from 'react'
import { AddProductToCart, MakeOrderFromCart, RemoveProductFromCart } from "./ShoppingCartCommands";
import { OrderMadeFromCart, ProductAddedToCart, ProductRemovedFromCart } from "./ShoppingCartEvent";

const ShoppingCart = () => {
    const [events, setEvents] = useState([]);
    const [order, setOrder] = useState(() => new Map());
    const [page, setPage] = useState(0);
    const [buttonLabel, setButtonLabel] = useState("Tee tilaus");


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
        if (event instanceof MakeOrderFromCart) {
            if (page === 0){
                console.log("OrderMadeFromCart()")
                tempEvents.push(new OrderMadeFromCart(order))
            }
            handleOrder()
        }

        setEvents(tempEvents)
        setOrder(tempMapOrder)
    }

    const products = ["Mozzarella", "Pepperooni", "Ananas", "Paprika", "Kesäkurpitsa", "Tonnikala", "Jauheliha", "Kebab", "Valkosipulidippi"]
    return (
        <div style={{"width": "100%"}}>
            <div style={{"display": "flex", "width": "100%", borderBottom: "3px double rgb(200, 10, 10)", paddingBottom: "10px", marginBottom: "10px"}}>
                {page % 3 === 0 &&
                    <div style={{"marginLeft": "50px", "width": "50%","display": "flex", "flexDirection" : "column", "justifyContent": "flex-start", "alignItems": "flex-start"}}>
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
                    <div style={{"width": "50%", padding: "10px"}}>
                        {events[events.length-1].toString()}
                    </div>
                }
                {page % 3 === 2 &&
                    <div style={{"width": "100%"}}>
                        <EventPrint events={events}/>
                    </div>
                }
                {page % 3 !== 2 &&
                    <Order
                        products={order}
                    />
                }

        </div>
        <div style={{"width": "100%", display: "flex"}}>
            <div style={{"width": "50%", margin: "50px"}}></div>
            <div style={{"width": "50%", display: "flex"}}>
                <button onClick={() => handleEvent(new MakeOrderFromCart(order))}>
                    {buttonLabel}
                </button>
            </div>
        </div>
      </div>

    );
}

const EventPrint = ({ events }) => {
    return (
        <div style={{display: "flex", justifyContent: "flex-start"}}>
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
                                    <td style={event instanceof ProductRemovedFromCart ? {color: "red"} : {}} key={index + "td3"}>
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
            <p>Hinta: {price} €</p>
        </div>
    );
  };

export default ShoppingCart;