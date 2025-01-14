import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEye,
  faUser,
  faCalendarAlt,
  faShoppingCart,
  faMoneyCheck,
  faDollarSign,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

// Utility function for status color
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Shipped":
      return "blue";
    case "Delivered":
      return "green";
    default:
      return "gray";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "http://localhost:8080"; // Update with your actual backend URL

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8082";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_BASE_URL]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (err) {
      setError("Failed to delete order. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    [order.username, order.orderId.toString()].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FontAwesomeIcon icon={faShoppingCart} style={styles.icon} /> All Orders
      </h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by Order ID or Username"
          style={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {filteredOrders.length > 0 ? (
        <div style={styles.ordersContainer}>
          {filteredOrders.map((order) => (
            <div key={order.orderId} style={styles.orderCard}>
              <h2 style={styles.orderId}>
                <FontAwesomeIcon icon={faShoppingCart} /> Order ID: {order.orderId}
              </h2>
              <p style={styles.orderInfo}>
                <FontAwesomeIcon icon={faUser} /> Username: {order.username}
              </p>
              <p style={styles.orderInfo}>
                <FontAwesomeIcon icon={faDollarSign} /> Total Price: ${order.totalPrice.toFixed(2)}
              </p>
              <p style={styles.orderInfo}>
                <FontAwesomeIcon icon={faCalendarAlt} /> Order Date:{" "}
                {new Date(order.orderDate).toLocaleString()}
              </p>
              <p style={styles.orderInfo}>
                <FontAwesomeIcon icon={faMoneyCheck} /> Payment Mode: {order.paymentMode}
              </p>
              <p style={{ ...styles.orderInfo, color: getStatusColor(order.status) }}>
                Status: {order.status}
              </p>
              <button
                style={styles.viewButton}
                onClick={() => setSelectedOrder(order)}
              >
                <FontAwesomeIcon icon={faEye} /> Details
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteOrder(order.orderId)}
              >
                <FontAwesomeIcon icon={faTrash} /> 
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}

      {selectedOrder && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Order Details</h3>
            <div style={styles.horizontalScroll}>
              {selectedOrder.orderItems.map((item) => (
                <div key={item.productId} style={styles.productCard}>
                  <img
                    src={`${BASE_URL}/${item.imagePath}`}
                    style={styles.productImage}
                  />
                  <h4 style={styles.productName}>{item.productName}</h4>
                  <p style={styles.productDetails}>Quantity: {item.quantity}</p>
                  <p style={styles.price}>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <button style={styles.closeModal} onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



const styles = {
    container: {
        fontFamily: "'Arial', sans-serif",
        padding: "10px",
        marginLest:'20%',
        
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        color: "#333",
    },
    icon: {
        marginRight: "10px",
        color: "rgb(208, 177, 0)",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
    },
    searchInput: {
        padding: "10px",
        fontSize: "14px",
        width: "300px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    searchIcon: {
        marginLeft: "-30px",
        fontSize: "20px",
        marginTop: "10px",
        color: "rgb(0, 0, 0)",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    ordersContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "20px",
    },
    orderCard: {
        backgroundColor: "#F5F5DC",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
        textAlign: "left",
    },
    orderId: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333",
    },
    orderInfo: {
        fontSize: "14px",
        marginBottom: "5px",
        color: "#555",
    },
    viewButton: {
        backgroundColor: "#f0c14b",
        color: "#111",
        padding: "5px",
        fontSize: "12px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "5px",
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        color: "#fff",
        padding: "5px",
        fontSize: "12px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "5px",
        marginLeft: "10px",
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Slightly darker for emphasis
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it overlays other elements
      },
      modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "80%",
        maxWidth: "700px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Slight shadow for depth
        overflowY: "auto", // Handle overflow for smaller screens
        maxHeight: "90vh", // Limit the height for accessibility
      },
      modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      },
      modalTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333",
      },
      closeModal: {
        backgroundColor: " #ffd800",
        color: "#000",
        padding: "8px 12px",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      },
      closeModalHover: {
        backgroundColor: "#0056b3",
      },
      horizontalScroll: {
        overflowX: "auto",
        display: "flex",
        gap: "15px",
        padding: "10px 0",
      },
      productCard: {
        textAlign: "center",
        backgroundColor: "rgb(251, 251, 251)",
        borderRadius: "10px",
       
        width: "150px",
        boxShadow: "1px 3px 7px rgba(255, 206, 8, 0.61)",
      },
      productImage: {
        width: '130px',
        height: '130px',
        objectFit: 'cover',
        marginTop:'0px',
        padding:'3px',
        
    },
      productName: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "5px",
        marginTop: "5px",
      },
      productDetails: {
        fontSize: "10px",
        color: "#666",
        marginTop: "5px",
      },
      price: {
        fontSize: "10px",
        fontWeight: "bold",
        marginTop: "5px",
        color: "#28a745",
        marginTop: "5px",
      },
};

export default Orders;
