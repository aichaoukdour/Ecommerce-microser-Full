import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const API_BASE_URL = 'http://localhost:8080';
  const REACT_APP_API_BASE_URL = "http://localhost:8082";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub.trim());
      } catch (err) {
        setError("Failed to decode token.");
        setLoading(false);
      }
    } else {
      setError("Token is missing.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Authentication token is missing. Please log in.");
            return;
          }

          const response = await axios.get(
            `${REACT_APP_API_BASE_URL}/orders/user/${username}/orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`Orders with items fetched from backend:`, response.data);

          setOrders(response.data);
          setFilteredOrders(response.data);
        } catch (err) {
          setError(
            err.response?.status === 401
              ? "Session expired. Please log in again."
              : `Failed to fetch orders. ${err.message}`
          );
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [username]);

  const styles = {
    container: { padding: "20px", fontFamily: "Times New Roman" },
    card: {
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: "#F5f5dc",
    },
    title: { textAlign: "center", marginBottom: "20px" },
    filterContainer: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" },
    input: { padding: "8px", border: "1px solid #ddd", borderRadius: "4px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
      backgroundColor: "#f4f4f4",
      fontWeight: "bold",
    },
    td: { border: "1px solid #ddd", padding: "8px", textAlign: "left" },
    evenRow: { backgroundColor: " #f9f9f9" },
    error: { color: "red", textAlign: "center" },
    loading: { textAlign: "center" },
    itemCard: {
      marginTop: "10px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      marginBottom: "10px",
    },
    itemTitle: {
      fontWeight: "bold",
      fontSize: "10px",
      marginBottom: "10px",
    },
    itemDetails: {
      marginBottom: "5px",
      fontSize: "10px",
    },
    orderDetailsContainer: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      backgroundColor: " #f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "80%",
      margin: "20px auto",
    },
    orderTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    orderInfo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: "14px",
      fontWeight: "normal",
    },
    cartItemContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr 1fr 1fr",
      gap: "15px",
      marginTop: "20px",
      borderTop: "1px solid #ddd",
      paddingTop: "20px",
    },
    cartItemCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "5px",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    cartItemImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    cartItemName: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "5px",
      marginTop: "5px",
    },
    cartItemQuantity: {
      fontSize: "12px",
      marginBottom: "5px",
      marginTop: "5px",
    },
    cartItemPrice: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#555",
      marginTop: "5px",
    },
    closeButton: {
      padding: "8px 6px",
      cursor: "pointer",
      width: '4%',
      backgroundColor: "rgb(227, 112, 99)",
      border: "1px solid #fff",
      borderRadius: "5px",
      color:'white',
      marginTop: "10px",
      position: "absolute", // Add this line
      top: "170px", // Adjust for top position
      right: "40px", // Adjust for right position
    },
    ordersContainer: {
      fontSize: '13px',
      display: "flex",
      flexDirection: "row",
      gap: "10px",
      justifyContent: "space-between",
    }
  };

  const handleFilter = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });
    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Set selected order to show its details
  };

  const closeDetails = () => {
    setSelectedOrder(null); // Reset selected order to close the details
  };

  if (loading) {
    return <p style={styles.loading}>Loading orders...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }
  
      const response = await axios.put(
        `${REACT_APP_API_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Order canceled successfully.");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Canceled" } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Canceled" } : order
        )
      );
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "Order not found."
          : "Failed to cancel the order. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Order History</h1>
        <div style={styles.filterContainer}>
          <input
            type="date"
            style={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            style={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <button onClick={handleFilter} style={styles.input}>
            Apply Filter
          </button>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No orders found for the selected date range.</p>
        ) : (
          <div style={styles.ordersContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Total Price</th>
                  <th style={styles.th}>Order Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Payment Mode</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <tr style={index % 2 === 0 ? styles.evenRow : undefined}>
                      <td style={styles.td}>{order.orderId}</td>
                      <td style={styles.td}>{order.totalPrice} €</td>
                      <td style={styles.td}>{formatDate(order.orderDate)}</td>
                      <td style={styles.td}>{order.status}</td>
                      <td style={styles.td}>{order.paymentMode}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleViewDetails(order)}
                          style={styles.input}
                        >
                          View Details
                        </button>
                        <button
    onClick={() => handleCancelOrder(order.orderId)}
    style={{ ...styles.input, backgroundColor: "#ffcccb" }}
  >
    Cancel
  </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {selectedOrder && (
  <div style={styles.orderDetailsContainer}>
    <h3 style={styles.orderTitle}>Order Details</h3>
    

    <button onClick={closeDetails} style={styles.closeButton}>Close</button>

    <div style={styles.cartItemContainer}>
      {selectedOrder.orderItems.map((item) => (
        <div key={item.productId} style={styles.cartItemCard}>
          <img
            src={`${API_BASE_URL}/${item.imagePath}`}
           
            style={styles.cartItemImage}
          />
          <p style={styles.cartItemName}>{item.productName}</p>
          <p style={styles.cartItemQuantity}>Quantity: {item.quantity}</p>
          <p style={styles.cartItemPrice}>{item.price} €</p>
        </div>
      ))}
    </div>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
