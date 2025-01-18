// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddedItems } from "../context/AddedItemsContext";
// import { useTableNum } from "../context/TableNumContext";
// import { icons } from "../../assets/icons/icons";
// import Footer from "../Footer/Footer";
// import "./AddedItems.css";
// import Header from "../Header/Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddedItems = () => {
//   const { addedItems, removeItem, updateItemCount, clearItems } = useAddedItems();
//   const { tableNum } = useTableNum();
//   const navigate = useNavigate();
//   const isAddpage = true;

//   const [option, setOption] = useState(false);
//   const [loading, setLoading] = useState(false); // New state to track loading
//   const [orders, setOrders] = useState(() => {
//     const savedOrders = sessionStorage.getItem('orders');
//     return savedOrders ? JSON.parse(savedOrders) : [];
//   });

//   useEffect(() => {
//     sessionStorage.setItem('orders', JSON.stringify(orders));
//   }, [orders]);

//   const handleMenuoption = () => {
//     setOption(true);
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleItemClick = (id) => {
//     navigate(`/menu/${id}`);
//   };

//   const handleQuantityChange = (id, quantity) => {
//     if (quantity > 0) {
//       updateItemCount(id, quantity);
//     }
//   };

//   const totalCost = addedItems.reduce((acc, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
//     const count = parseInt(item.count, 10);

//     console.log(`Item: ${item.name}, Price: ${price}, Count: ${count}`);

//     if (!isNaN(price) && !isNaN(count)) {
//       return acc + (price * count);
//     } else {
//       console.warn(`Invalid price or count for item: ${item.name}`);
//       return acc;
//     }
//   }, 0);

//   const sendOrder = async () => {
//     if (addedItems.length === 0) {
//       toast.error("No items to order. Please add items first.");
//       return;
//     }

//     if (!tableNum) {
//       console.warn('Table Number is not defined');
//       return;
//     }

//     const tableNumberInt = parseInt(tableNum, 10);

//     if (isNaN(tableNumberInt)) {
//       console.warn('Invalid Table Number');
//       return;
//     }

//     const dishes = addedItems.map(item => ({
//       name: item.name,
//       quantity: item.count,
//       image: item.image,
//       price: item.price
//     }));

//     const orderData = {
//       tableNumber: tableNumberInt,
//       dishes,
//     };

//     console.log("Order data being sent:", orderData);

//     try {
//       setLoading(true); // Set loading to true when sending starts
//       const response = await fetch('https://server-server.gofastapi.com/sendOrder', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (response.ok) {
//         console.log('Order sent successfully');
//         setOrders(prevOrders => [...addedItems, ...prevOrders]); // New orders on top
//         clearItems();
//         toast.success("Order sent successfully!");
//       } else {
//         console.error('Failed to send order');
//         toast.error("Failed to send order. Please try again.");
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       toast.error("Error sending order. Please try again.");
//     } finally {
//       setLoading(false); // Reset loading when request completes
//     }
//   };

//   const ordersTotalCost = orders.reduce((acc, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
//     const count = parseInt(item.count, 10);

//     if (!isNaN(price) && !isNaN(count)) {
//       return acc + (price * count);
//     } else {
//       console.warn(`Invalid price or count for item: ${item.name}`);
//       return acc;
//     }
//   }, 0);

//   return (
//     <>
//       <div className="added-items-main">
//         <Header isAddpage={isAddpage} />
//         <ToastContainer />
//         <div className="added-items">
//           <h3 style={{ textAlign: "center" }}>
//             Passer la commande
//           </h3>
//           {addedItems.length === 0 ? (
//             <p>No items added yet...</p>
//           ) : (
//             <ul>
//               {addedItems.map((item, index) => (
//                 <li key={index}>
//                   <div className="added-item">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="added-item-image"
//                       onClick={() => handleItemClick(item.id)}
//                     />
//                     <div
//                       className="added-item-info"
//                       onClick={() => handleItemClick(item.id)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <h3 className="added-item-name">{item.name}</h3>
//                       <p className="added-item-price">{item.price}</p>
//                       <span>Quantity X{item.count}</span>
//                     </div>
//                     <button className="added-item-edit" onClick={() => handleItemClick(item.id)}><img src={icons.edit_icon} alt="" /></button>
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       className="delete-button"
//                     >
//                       <img src={icons.delete_icon} alt="" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="total-cost">
//             <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
//           </div>
//           <button className="go-back" onClick={handleGoBack}>
//             Go Back
//           </button>
//           <button
//             className="send-order"
//             onClick={sendOrder}
//             disabled={loading} // Disable the button when loading
//           >
//             {loading ? "Sending..." : "Send Order"} {/* Show loading text */}
//           </button>
//         </div>
//         <div className="your-orders">
//           <h2>Your Orders</h2>
//           {orders.length === 0 ? (
//             <p>No orders placed yet...</p>
//           ) : (
//             <>
//               <ul>
//                 {orders.map((item, index) => (
//                   <li key={index}>
//                     <div className="order-item">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="order-item-image"
//                       />
//                       <div className="order-item-info">
//                         <h3>{item.name}</h3>
//                         <p>Quantity: {item.count}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//               <div className="orders-total-cost">
//                 <h3>Total Amount: ${ordersTotalCost.toFixed(2)}</h3>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default AddedItems;


// ---------------------------------------------------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddedItems } from "../context/AddedItemsContext";
// import { useTableNum } from "../context/TableNumContext";
// import { icons } from "../../assets/icons/icons";
// import Footer from "../Footer/Footer";
// import "./AddedItems.css";
// import Header from "../Header/Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddedItems = () => {
//   const { addedItems, removeItem, updateItemCount, clearItems } = useAddedItems();
//   const { tableNum } = useTableNum();
//   const navigate = useNavigate();
//   const isAddpage = true;

//   const [option, setOption] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState(() => {
//     const savedOrders = sessionStorage.getItem('orders');
//     return savedOrders ? JSON.parse(savedOrders) : [];
//   });

//   const [orderSent, setOrderSent] = useState(false);
//   const [tokenId, setTokenId] = useState(''); // State to store the token ID

//   useEffect(() => {
//     sessionStorage.setItem('orders', JSON.stringify(orders));
//   }, [orders]);

//   const handleMenuoption = () => {
//     setOption(true);
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleItemClick = (id) => {
//     navigate(`/menu/${id}`);
//   };

//   const handleQuantityChange = (id, quantity) => {
//     if (quantity > 0) {
//       updateItemCount(id, quantity);
//     }
//   };

//   const totalCost = addedItems.reduce((acc, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
//     const count = parseInt(item.count, 10);

//     console.log(`Item: ${item.name}, Price: ${price}, Count: ${count}`);

//     if (!isNaN(price) && !isNaN(count)) {
//       return acc + (price * count);
//     } else {
//       console.warn(`Invalid price or count for item: ${item.name}`);
//       return acc;
//     }
//   }, 0);
  
//   const generateRandomTokenId = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const sendOrder = async () => {
//     if (addedItems.length === 0) {
//       toast.error("No items to order. Please add items first.");
//       return;
//     }

//     if (tableNum < 0 || tableNum > 10) {
//       toast.error("Invalid table number. Please choose a table number between 0 and 10.");
//       return;
//     }

//     const tableNumberInt = parseInt(tableNum, 10);

//     const dishes = addedItems.map(item => ({
//       name: item.name,
//       quantity: item.count,
//       image: item.image,
//       price: item.price
//     }));

//     const newTokenId = generateRandomTokenId();


//     const orderData = {
//       tableNumber: tableNumberInt,
//       dishes,
//       tokenId: newTokenId
//     };

//     console.log("Order data being sent:", orderData);

//     try {
//       setLoading(true);
//       const response = await fetch('https://server3-server3.gofastapi.com/sendOrder', {
      
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//     });
//       console.log("1st place");
//       if (response.ok) {
//         clearItems();
//         setOrders(prevOrders => [
//             {
//                 // tableNumber: tableNumberInt,
//                 // dishes,
//                 // total: totalCost,
//                 // timestamp: new Date(),
//                 // tokenId: newTokenId // Add tokenId to the order
//                 ...orderData,
//                 total: totalCost,
//                 timestamp: new Date(),
//             },
//             ...prevOrders
//         ]);
        
//         setOrderSent(true);
//         toast.success("Order sent successfully!");
//     } else {
//         const errorData = await response.json(); // Attempt to read the error message
//         console.error('Failed to send order:', errorData);
//         toast.error("Failed to send order: " + errorData.error);
//     }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       toast.error("Error sending order. Please try again. this catch part");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ordersTotalCost = orders.reduce((acc, order) => acc + order.total, 0);

//   return (
//     <>
//       <div className="added-items-main">
//         <Header isAddpage={isAddpage} />
//         <ToastContainer />
//         <div className="added-items">
//           {orderSent && tableNum === 0 ? (
//             <h3 style={{ textAlign: "center" }}>
//               Collect the order from the restaurant and Remember the Token ID
//             </h3>
//           ) : (
//             <h3 style={{ textAlign: "center" }}>
//               Passer la commande
//             </h3>
//           )}

//           {addedItems.length === 0 ? (
//             <p>No items added yet...</p>
//           ) : (
//             <ul>
//               {addedItems.map((item, index) => (
//                 <li key={index}>
//                   <div className="added-item">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="added-item-image"
//                       onClick={() => handleItemClick(item.id)}
//                     />
//                     <div
//                       className="added-item-info"
//                       onClick={() => handleItemClick(item.id)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <h3 className="added-item-name">{item.name}</h3>
//                       <p className="added-item-price">{item.price}</p>
//                       <span>Quantity X{item.count}</span>
//                     </div>
//                     <button className="added-item-edit" onClick={() => handleItemClick(item.id)}>
//                       <img src={icons.edit_icon} alt="" />
//                     </button>
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       className="delete-button"
//                     >
//                       <img src={icons.delete_icon} alt="" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="total-cost">
//             <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
//           </div>
//           <button className="go-back" onClick={handleGoBack}>
//             Go Back
//           </button>
//           <button
//             className="send-order"
//             onClick={sendOrder}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Order"}
//           </button>
//         </div>
//         <div className="your-orders">
//           <h2>Your Orders</h2>
//           {orders.length === 0 ? (
//             <p>No orders placed yet...</p>
//           ) : (
//             <>
//               <ul>
//                 {orders.map((order, index) => (
//                   <li key={index}>
//                     <div className="order">
//                       <h3>Table Number: {order.tableNumber}</h3>
//                       <h4>Token ID: {order.tokenId}</h4> {/* Display the token ID here */}
//                       <ul>
//                         {order.dishes.map((dish, dishIndex) => (
//                           <li key={dishIndex}>
//                             <div className="order-item">
//                               <img
//                                 src={dish.image}
//                                 alt={dish.name}
//                                 className="order-item-image"
//                               />
//                               <div className="order-item-info">
//                                 <h4>{dish.name}</h4>
//                                 <p>Quantity: {dish.quantity}</p>
//                                 <p>Price: {dish.price}</p>
//                               </div>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                       <div className="order-total-cost">
//                         <h4>Total Amount: ${order.total.toFixed(2)}</h4>
//                       </div>
//                       <div className="order-timestamp">
//                         <p>Ordered At: {new Date(order.timestamp).toLocaleString()}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//               <div className="orders-total-cost">
//                 <h3>Total Amount of All Orders: ${ordersTotalCost.toFixed(2)}</h3>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default AddedItems;













































// -----------------------------------------------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddedItems } from "../context/AddedItemsContext";
// import { useTableNum } from "../context/TableNumContext";
// import { icons } from "../../assets/icons/icons";
// import Footer from "../Footer/Footer";
// import "./AddedItems.css";
// import Header from "../Header/Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddedItems = () => {
//   const { addedItems, removeItem, updateItemCount, clearItems } = useAddedItems();
//   const { tableNum } = useTableNum();
//   const navigate = useNavigate();
//   const isAddpage = true;

//   const [option, setOption] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState(() => {
//     const savedOrders = sessionStorage.getItem('orders');
//     return savedOrders ? JSON.parse(savedOrders) : [];
//   });

//   const [orderSent, setOrderSent] = useState(false);
//   const [tokenId, setTokenId] = useState(''); // State to store the token ID

//   useEffect(() => {
//     sessionStorage.setItem('orders', JSON.stringify(orders));
//   }, [orders]);

//   const handleMenuoption = () => {
//     setOption(true);
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleItemClick = (id) => {
//     navigate(`/menu/${id}`);
//   };

//   const handleQuantityChange = (id, quantity) => {
//     if (quantity > 0) {
//       updateItemCount(id, quantity);
//     }
//   };

//   const totalCost = addedItems.reduce((acc, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
//     const count = parseInt(item.count, 10);

//     console.log(`Item: ${item.name}, Price: ${price}, Count: ${count}`);

//     if (!isNaN(price) && !isNaN(count)) {
//       return acc + (price * count);
//     } else {
//       console.warn(`Invalid price or count for item: ${item.name}`);
//       return acc;
//     }
//   }, 0);

//   const generateRandomTokenId = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   // Function to check if the current time is between 11 PM and 6 AM
//   const isOrderRestrictedTime = () => {
//     const currentHour = new Date().getHours();
//     return currentHour >= 22 || currentHour < 6; // true if time is 11 PM to 6 AM
//   };

//   const sendOrder = async () => {
//     if (addedItems.length === 0) {
//       toast.error("No items to order. Please add items first.");
//       return;
//     }

//     if (tableNum < 0 || tableNum > 10) {
//       toast.error("Invalid table number. Please choose a table number between 0 and 10.");
//       return;
//     }

//     // Check if the table number is 0 and it's within the restricted hours
//     if (tableNum === 0 && isOrderRestrictedTime()) {
//       toast.error("Orders cannot be placed between 11 PM and 6 AM.");
//       return;
//     }

//     const tableNumberInt = parseInt(tableNum, 10);

//     const dishes = addedItems.map(item => ({
//       name: item.name,
//       quantity: item.count,
//       image: item.image,
//       price: item.price
//     }));

//     const newTokenId = generateRandomTokenId();

//     const orderData = {
//       tableNumber: tableNumberInt,
//       dishes,
//       tokenId: newTokenId
//     };

//     console.log("Order data being sent:", orderData);

//     try {
//       setLoading(true);
//       const response = await fetch('https://server3-server3.gofastapi.com/sendOrder', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });
//       if (response.ok) {
//         clearItems();
//         setOrders(prevOrders => [
//           {
//             ...orderData,
//             total: totalCost,
//             timestamp: new Date(),
//           },
//           ...prevOrders
//         ]);
        
//         setOrderSent(true);
//         toast.success("Order sent successfully!");
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to send order:', errorData);
//         toast.error("Failed to send order: " + errorData.error);
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       toast.error("Error sending order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ordersTotalCost = orders.reduce((acc, order) => acc + order.total, 0);

//   return (
//     <>
//       <div className="added-items-main">
//         <Header isAddpage={isAddpage} />
//         <ToastContainer />

//         {/* Marquee notification when the order is restricted */}
//         {tableNum === 0 && isOrderRestrictedTime() && (
//           <div className="scrolling-text-container">
//               <p className="scrolling-text">
//                  ❗❗ Les commandes peuvent être passées entre 22h et 6h, ainsi qu'entre 12h00 et 13h30.❗❗
//               </p>
//           </div>

//         )}

//         <div className="added-items">
//           {orderSent && tableNum === 0 ? (
//             <h3 style={{ textAlign: "center" }}>
//               Souvenez-vous de l'ID de jeton, récupérez la commande et ne fermez pas l'onglet.
//             </h3>
//           ) : (
//             <h3 style={{ textAlign: "center" }}>
//               Passer la commande
//             </h3>
//           )}

//           {addedItems.length === 0 ? (
//             <p>Aucun article ajouté pour le moment..</p>
//           ) : (
//             <ul>
//               {addedItems.map((item, index) => (
//                 <li key={index}>
//                   <div className="added-item">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="added-item-image"
//                       onClick={() => handleItemClick(item.id)}
//                     />
//                     <div
//                       className="added-item-info"
//                       onClick={() => handleItemClick(item.id)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <h3 className="added-item-name">{item.name}</h3>
//                       <p className="added-item-price">{item.price}</p>
//                       <span>Quantité X{item.count}</span>
//                     </div>
//                     <button className="added-item-edit" onClick={() => handleItemClick(item.id)}>
//                       <img src={icons.edit_icon} alt="" />
//                     </button>
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       className="delete-button"
//                     >
//                       <img src={icons.delete_icon} alt="" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="total-cost">
//             <h3>Coût total: ${totalCost.toFixed(2)}</h3>
//           </div>
//           <button className="go-back" onClick={handleGoBack}>
//             Retour
//           </button>
//           <button
//             className="send-order"
//             onClick={sendOrder}
//             disabled={loading || (tableNum === 0 && isOrderRestrictedTime())}
//           >
//             {loading ? "Sending..." : "envoi"}
//           </button>
//         </div>
//         <div className="your-orders">
//           <h2>Vos commandes</h2>
//           {orders.length === 0 ? (
//             <p>Aucune commande passée pour le moment...</p>
//           ) : (
//             <>
//               <ul>
//                 {orders.map((order, index) => (
//                   <li key={index}>
//                     <div className="order">
//                       <h3>Numéro de table : {order.tableNumber}</h3>
//                       <h4>ID de jeton: {order.tokenId}</h4> {/* Display the token ID here */}
//                       <ul>
//                         {order.dishes.map((dish, dishIndex) => (
//                           <li key={dishIndex}>
//                             <div className="order-item">
//                               <img
//                                 src={dish.image}
//                                 alt={dish.name}
//                                 className="order-item-image"
//                               />
//                               <div className="order-item-info">
//                                 <h4>{dish.name}</h4>
//                                 <p>Quantity: {dish.quantity}</p>
//                                 <p>Price: {dish.price}</p>
//                               </div>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                       <div className="order-total-cost">
//                         <h4>Montant total: ${order.total.toFixed(2)}</h4>
//                       </div>
//                       <div className="order-timestamp">
//                         <p>Commandé à: {new Date(order.timestamp).toLocaleString()}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//               <div className="orders-total-cost">
//                 <h3>Montant total de toutes les commandes: ${ordersTotalCost.toFixed(2)}</h3>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default AddedItems;












































































// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddedItems } from "../context/AddedItemsContext";
// import { useTableNum } from "../context/TableNumContext";
// import { icons } from "../../assets/icons/icons";
// import Footer from "../Footer/Footer";
// import "./AddedItems.css";
// import Header from "../Header/Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddedItems = () => {
//   const { addedItems, removeItem, updateItemCount, clearItems } = useAddedItems();
//   const { tableNum } = useTableNum();
//   const navigate = useNavigate();
//   const isAddpage = true;

//   const [option, setOption] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState(() => {
//     const savedOrders = sessionStorage.getItem('orders');
//     return savedOrders ? JSON.parse(savedOrders) : [];
//   });

//   const [orderSent, setOrderSent] = useState(false);
//   const [tokenId, setTokenId] = useState(''); // State to store the token ID
//   const [successMessage, setSuccessMessage] = useState(''); // State to show success message
//   const [isWednesday] = useState(false);

  



//   useEffect(() => {
//     sessionStorage.setItem('orders', JSON.stringify(orders));
//   }, [orders]);

//   const handleMenuoption = () => {
//     setOption(true);
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleItemClick = (id) => {
//     navigate(`/menu/${id}`);
//   };

//   const handleQuantityChange = (id, quantity) => {
//     if (quantity > 0) {
//       updateItemCount(id, quantity);
//     }
//   };

//   const totalCost = addedItems.reduce((acc, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
//     const count = parseInt(item.count, 10);

//     console.log(`Item: ${item.name}, Price: ${price}, Count: ${count}`);

//     if (!isNaN(price) && !isNaN(count)) {
//       return acc + (price * count);
//     } else {
//       console.warn(`Invalid price or count for item: ${item.name}`);
//       return acc;
//     }
//   }, 0);

//   const generateRandomTokenId = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   // Function to check if the current time is between 11 PM and 6 AM
//   const isOrderRestrictedTime = () => {
//     const currentTime = new Date();
//     const currentHour = currentTime.getHours();
//     const currentMinutes = currentTime.getMinutes();

//     // Function to check if the time is within a specific allowed range
//     const isWithinAllowedRange = (startHour, startMinutes, endHour, endMinutes) => {
//         const startTime = startHour * 60 + startMinutes;
//         const endTime = endHour * 60 + endMinutes;
//         const currentTimeInMinutes = currentHour * 60 + currentMinutes;

//         return currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime;
//     };

//     // Check if the current time falls within any of the allowed ranges
//     const isAllowed = 
//         isWithinAllowedRange(10, 30, 14, 0) || // 10:30 AM to 2:00 PM
//         isWithinAllowedRange(18, 30, 22, 0);  // 6:30 PM to 10:00 PM

//     return !isAllowed; // Restrict if not in the allowed range
// };


//   const sendOrder = async () => {
//     if (addedItems.length === 0) {
//       toast.error("No items to order. Please add items first.");
//       return;
//     }

//     if (tableNum < 0 || tableNum > 10) {
//       toast.error("Invalid table number. Please choose a table number between 0 and 10.");
//       return;
//     }

//     // Check if the table number is 0 and it's within the restricted hours
//     if (tableNum === 0 && isOrderRestrictedTime()) {
//       toast.error("Orders cannot be placed between 10.30 to 14.00  and 18.30 to 22.");
//       return;
//     }

//     const tableNumberInt = parseInt(tableNum, 10);

//     const dishes = addedItems.map(item => ({
//       name: item.name,
//       quantity: item.count,
//       image: item.image,
//       price: item.price
//     }));

//     const newTokenId = generateRandomTokenId();

//     const orderData = {
//       tableNumber: tableNumberInt,
//       dishes,
//       tokenId: newTokenId
//     };

//     console.log("Order data being sent:", orderData);

//     try {
//       setLoading(true);
//       const response = await fetch('https://server3-kashmir.gofastapi.com/sendOrder', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });
//       if (response.ok) {
//         clearItems();
//         setOrders(prevOrders => [
//           {
//             ...orderData,
//             total: totalCost,
//             timestamp: new Date(),
//           },
//           ...prevOrders
//         ]);
        
//         setOrderSent(true);
//         setSuccessMessage("Order sent successfully! Remember your Token ID.");
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to send order:', errorData);
//         toast.error("Failed to send order: " + errorData.error);
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       toast.error("Error sending order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ordersTotalCost = orders.reduce((acc, order) => acc + order.total, 0);

//   return (
//     <>
//       <div className="added-items-main">
//         <Header isAddpage={isAddpage} />
//         <ToastContainer />

//         {/* Marquee notification when the order is restricted */}
//         { tableNum === 0 && isOrderRestrictedTime() && (
//           <div className="scrolling-text-container">
//               <p className="scrolling-text">
//                  ❗❗ Order  between 10:30 AM to 2:00 PM and 6:30 PM to 10:00 PM❗❗
//               </p>
//           </div>
//         )}

//         {/* Display success message like a toast */}
//         {successMessage && (
//           <div className="order-success-message">
//             <p>{successMessage}</p>
//           </div>
//         )}

//         <div className="added-items">
//           {orderSent && tableNum === 0 ? (
//             <h3 style={{ textAlign: "center" }}>
//               Souvenez-vous de l'ID de jeton, récupérez la commande et ne fermez pas l'onglet.
//             </h3>
//           ) : (
//             <h3 style={{ textAlign: "center" }}>
//               Passer la commande
//             </h3>
//           )}

//           {addedItems.length === 0 ? (
//             <p>Aucun article ajouté pour le moment..</p>
//           ) : (
//             <ul>
//               {addedItems.map((item, index) => (
//                 <li key={index}>
//                   <div className="added-item">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="added-item-image"
//                       onClick={() => handleItemClick(item.id)}
//                     />
//                     <div
//                       className="added-item-info"
//                       onClick={() => handleItemClick(item.id)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <h3 className="added-item-name">{item.name}</h3>
//                       <p className="added-item-price">{item.price}</p>
//                       <span>Quantité X{item.count}</span>
//                     </div>
//                     <button className="added-item-edit" onClick={() => handleItemClick(item.id)}>
//                       <img src={icons.edit_icon} alt="" />
//                     </button>
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       className="delete-button"
//                     >
//                       <img src={icons.delete_icon} alt="" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="total-cost">
//             <h3>Coût total: ${totalCost.toFixed(2)}</h3>
//           </div>
//           <button className="go-back" onClick={handleGoBack}>
//             Retour
//           </button>
//           <button
//             className="send-order"
//             onClick={sendOrder}
//             disabled={loading} // Disable on Wednesday
//           >
//             {loading ? "Sending..." : "envoi"}
//           </button>
//         </div>
//         <div className="your-orders">
//           <h2>Vos commandes</h2>
//           {orders.length === 0 ? (
//             <p>Aucune commande passée pour le moment...</p>
//           ) : (
//             <>
//               <ul>
//                 {orders.map((order, index) => (
//                   <li key={index}>
//                     <div className="order">
//   {/* Only show table number if it's not 0 */}
//   {order.tableNumber !== 0 && (
//     <h3>Numéro de table : {order.tableNumber}</h3>
//   )}
//   <h4>ID de jeton: {order.tokenId}</h4> {/* Display the token ID here */}
//   <ul>
//     {order.dishes.map((dish, dishIndex) => (
//       <li key={dishIndex}>
//         <div className="order-item">
//           <img
//             src={dish.image}
//             alt={dish.name}
//             className="order-item-image"
//           />
//           <div className="order-item-info">
//             <h4>{dish.name}</h4>
//             <p>Quantity: {dish.quantity}</p>
//             <p>Price: {dish.price}</p>
//           </div>
//         </div>
//       </li>
//     ))}
//   </ul>
//   <div className="order-total-cost">
//     <h4>Montant total: ${order.total.toFixed(2)}</h4>
//   </div>
// </div>

//                   </li>
//                 ))}
//               </ul>
//               <div className="total-orders-cost">
//                 <h3>Montant total des commandes: ${ordersTotalCost.toFixed(2)}</h3>
//               </div>
//             </>
//           )}
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default AddedItems;




























import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddedItems } from "../context/AddedItemsContext";
import { useTableNum } from "../context/TableNumContext";
import { icons } from "../../assets/icons/icons";
import Footer from "../Footer/Footer";
import "./AddedItems.css";
import Header from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpVerification from "./OtpVerification";

const AddedItems = () => {
  const { addedItems, removeItem, updateItemCount, clearItems } = useAddedItems();
  const { tableNum } = useTableNum();
  const navigate = useNavigate();
  const isAddpage = true;

  const [option, setOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(() => {
    const savedOrders = sessionStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [orderSent, setOrderSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    sessionStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleItemClick = (id) => {
    navigate(`/menu/${id}`);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      updateItemCount(id, quantity);
    }
  };

  const totalCost = addedItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    const count = parseInt(item.count, 10);

    if (!isNaN(price) && !isNaN(count)) {
      return acc + price * count;
    }
    return acc;
  }, 0);

  const generateRandomTokenId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const isOrderRestrictedTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    const isWithinAllowedRange = (startHour, startMinutes, endHour, endMinutes) => {
      const startTime = startHour * 60 + startMinutes;
      const endTime = endHour * 60 + endMinutes;
      const currentTimeInMinutes = currentHour * 60 + currentMinutes;
      return currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime;
    };

    const isAllowed =
      isWithinAllowedRange(0, 0, 24, 0) 
    return !isAllowed;
  };

  const processOrder = async () => {
    if (addedItems.length === 0) {
      toast.error("No items to order. Please add items first.");
      return;
    }
    console.log("11111");
    if (tableNum < 0 || tableNum > 10) {
      toast.error("Invalid table number. Please choose a table number between 0 and 10.");
      return;
    }

    if (tableNum === 0 && isOrderRestrictedTime()) {
      toast.error("Orders cannot be placed between 10:30 to 14:00 and 18:30 to 22:00.");
      return;
    }
    console.log("2222");
    const tableNumberInt = parseInt(tableNum, 10);

    const dishes = addedItems.map((item) => ({
      name: item.name,
      quantity: item.count,
      image: item.image,
      price: item.price,
    }));
    console.log("3333");
    const newTokenId = generateRandomTokenId();

    const orderData = {
      tableNumber: tableNumberInt,
      dishes,
      tokenId: newTokenId,
      email: userEmail,
    };
    console.log("4444");
    console.log("email ID is",userEmail);
    try {
      setLoading(true);
      const response = await fetch("https://kashmir-server4.gofastapi.com/sendOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      console.log("5555");
      if (response.ok) {
        clearItems();
        setOrders((prevOrders) => [
          {
            ...orderData,
            total: totalCost,
            timestamp: new Date(),
          },
          ...prevOrders,
        ]);
        setOrderSent(true);
        setSuccessMessage("Order sent successfully! Remember your Token ID.");
      } else {
        const errorData = await response.json();
        toast.error("Failed to send order: " + errorData.error);
      }
    } catch (error) {
      toast.error("Error sending order. Please try again.");
    } finally {
      setLoading(false);
    }
    console.log("6666");
  };

  const handleSendOrder = () => {
    setIsOtpModalVisible(true);
  };

  return (
    <>
      <div className="added-items-main">
        <Header isAddpage={isAddpage} />
        <ToastContainer />

        {/* Show OTP Modal */}
        {isOtpModalVisible && (
          <OtpVerification
            onVerify={() => {
              setIsOtpModalVisible(false);
              processOrder();
            }}
            onCancel={() => setIsOtpModalVisible(false)}
            onEmailUpdate={(email) => setUserEmail(email)}
          />
        )}

        {/* Display Success Message */}
        {successMessage && (
          <div className="order-success-message">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="added-items">
          {/* Title Section */}
          {orderSent && tableNum === 0 ? (
            <h3 style={{ textAlign: "center" }}>
              Souvenez-vous de l'ID de jeton, récupérez la commande et ne fermez pas l'onglet.
            </h3>
          ) : (
            <h3 style={{ textAlign: "center" }}>
              Passer la commande
            </h3>
          )}

          {/* Display Added Items */}
          {addedItems.length === 0 ? (
            <p>Aucun article ajouté pour le moment..</p>
          ) : (
            <ul>
              {addedItems.map((item, index) => (
                <li key={index}>
                  <div className="added-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="added-item-image"
                      onClick={() => handleItemClick(item.id)}
                    />
                    <div
                      className="added-item-info"
                      onClick={() => handleItemClick(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <h3 className="added-item-name">{item.name}</h3>
                      <p className="added-item-price">{item.price}</p>
                      <span>Quantité X{item.count}</span>
                    </div>
                    <button
                      className="added-item-edit"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <img src={icons.edit_icon} alt="" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="delete-button"
                    >
                      <img src={icons.delete_icon} alt="" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Total Cost */}
          <div className="total-cost">
            <h3>Coût total: ${totalCost.toFixed(2)}</h3>
          </div>

          {/* Buttons */}
          <button className="go-back" onClick={handleGoBack}>Retour</button>
          <button
            className="send-order"
            onClick={handleSendOrder}
            disabled={loading}
          >
            {loading ? "Sending..." : "envoi"}
          </button>
        </div>

        {/* Display Past Orders */}
        <div className="your-orders">
          <h2>Vos commandes</h2>
          {orders.length === 0 ? (
            <p>Aucune commande passée pour le moment...</p>
          ) : (
            <>
              <ul>
                {orders.map((order, index) => (
                  <li key={index}>
                    <div className="order">
                      {/* Only show table number if it's not 0 */}
                      {order.tableNumber !== 0 && (
                        <h3>Numéro de table : {order.tableNumber}</h3>
                      )}
                      <h4>ID de jeton: {order.tokenId}</h4>
                      <ul>
                        {order.dishes.map((dish, dishIndex) => (
                          <li key={dishIndex}>
                            <div className="order-item">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="order-item-image"
                              />
                              <div className="order-item-info">
                                <h4>{dish.name}</h4>
                                <p>Quantity: {dish.quantity}</p>
                                <p>Price: {dish.price}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="order-total-cost">
                        <h4>Montant total: ${order.total.toFixed(2)}</h4>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="total-orders-cost">
                <h3>Montant total des commandes: ${orders.reduce((acc, order) => acc + order.total, 0).toFixed(2)}</h3>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AddedItems;