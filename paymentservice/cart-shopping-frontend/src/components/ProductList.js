import React, { useEffect, useState } from 'react';
import axios from 'axios';
import welcomeVideo1 from '../assets/welcome.mp4';
import welcomeVideo2 from '../assets/welcome2.mp4';
import welcomeVideo3 from '../assets/welcome3.mp4';
import backgroundImg from '../assets/img.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import backgroundImage from '../assets/background.jpg'; // Lien de votre image

const API_BASE_URL = 'http://localhost:8080';
const CART_API_URL = 'http://localhost:8081/api/cart/user/';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#F5f5dc',
    },
    welcomeContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1300px',
        
        marginBottom: '5px',
        borderRadius: '15px',
        overflow: 'hidden',
       backgroundColor:'#F5f5dc',
       backdropFilter: 'blur(40px)',
       backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
    },
    welcomeVideo: {
        width: '100%',
        height: '200px',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    },
    welcomeText: {
        textAlign: 'center',
        fontFamily: 'Times New Roman',
        fontSize: '1.5em',

        fontWeight: 'bold',
        marginTop: '6px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    },
    productList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor:'#F5f5dc',
        margin: '20px 0',
        
        fontFamily: 'Times New Roman',
    },
    productCard: {
        fontFamily: 'Times New Roman',
        width: '130px',
        height: '210px',
        margin: '10px',
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.3s ease',
    },
    productImage: {
        width: '130px',
        height: '130px',
        objectFit: 'cover',
        marginTop: '5px',
    },
    productDetails: {
        fontFamily: 'Times New Roman',
        padding: '10px',
        textAlign: 'left',
    },
    productName: {
        fontFamily: 'Times New Roman',
        fontSize: '10px',
        margin: '5px 0',
    },
    productPrice: {
        fontSize: '9px',
        fontFamily: 'Times New Roman',
        color: '#555',
    },
    addToCart: {
        fontFamily: 'Times New Roman',
        padding: '5px 5px',
        backgroundColor: '#008300',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '7px',
        cursor: 'pointer',
    },
    spinner: {
        border: '8px solid #f3f3f3', // Light grey
        borderTop: '8px solid #ffd800', // Blue
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 2s linear infinite',
        margin: 'auto',
    }, 
    searchInput: {
        fontFamily: 'Times New Roman',
        padding: '12px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '30px',
        border: '1px solid #ffd800', // Bordure verte
        boxShadow: '0px 4px 6px rgba(0, 128, 0, 0.2)', // Ombre subtile
        fontSize: '14px',
        color: '#555',
        outline: 'none',
        transition: 'box-shadow 0.3s ease, border 0.3s ease',
    },
    searchInputFocus: {
        border: '1px solid #ffd800', // Bordure verte accentuée au focus
        boxShadow: '0px 6px 12px rgba(0, 128, 0, 0.3)', // Ombre plus marquée
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '15px 20px',
        backgroundColor: 'rgba(250, 245, 178, 0.3)',// Vert très clair
        borderRadius: '15px',
        boxShadow: '0px 4px 8px rgba(0, 128, 0, 0.2)', // Ombre subtile
        marginBottom: '20px',
    },
    filterLabel: {
        fontFamily: 'Times New Roman',
        marginRight: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'rgb(126, 147, 8)', // Vert foncé
    },
    filterSelect: {
        padding: '10px',
        borderRadius: '30px',
        border: '1px solid #ffd800',
        fontSize: '14px',
        fontFamily: 'Times New Roman',
        backgroundColor: '#e8f5e8', // Vert pastel
        color: '#006400', // Texte vert foncé
        boxShadow: '0px 2px 4px rgba(0, 128, 0, 0.2)',
        transition: 'box-shadow 0.3s ease, border 0.3s ease',
    },
    filterSelectFocus: {
        border: '1px solid #ffd800',
        boxShadow: '0px 6px 12px rgba(0, 128, 0, 0.3)', // Ombre plus marquée
    },
};

const ProductList = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);  // Define the filteredProducts state

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/product`);
                console.log('Fetched products:', response.data);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // Filter products based on search query, price, and category
        const filtered = products.filter((product) => {
            const matchesSearchQuery =
                product.productName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriceFilter =
                priceFilter === 'all' || product.price <= parseInt(priceFilter);
            const matchesCategoryFilter =
                categoryFilter === 'all' || product.category === categoryFilter;

            return matchesSearchQuery && matchesPriceFilter && matchesCategoryFilter;
        });

        setFilteredProducts(filtered);  // Use the state setter here
    }, [searchQuery, priceFilter, categoryFilter, products]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePriceFilterChange = (e) => {
        setPriceFilter(e.target.value);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const addToCart = async (productId, productName, price, quantity = 1, imagePath) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add items to the cart');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const username = decodedToken?.sub?.trim();

            if (!username) {
                toast.error('Failed to retrieve user information. Please log in again.');
                return;
            }

            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('productName', productName);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('imagePath', imagePath);

            console.log('Data being sent to the cart API:', {
                productId,
                productName,
                price,
                quantity,
                imagePath,
            });

            await axios.post(`${CART_API_URL}${username}/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Item successfully added to cart');
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const handleAddToCart = (product) => {
        const imagePath = product.imagePath;
        addToCart(product.productId, product.productName, product.price, 1, imagePath);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={styles.spinner}></div>
                <div>Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                {error} <button onClick={() => setLoading(true)}>Retry</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.welcomeContainer}>
                <video src={welcomeVideo1} autoPlay loop muted style={styles.welcomeVideo} />
                <video src={welcomeVideo2} autoPlay loop muted style={styles.welcomeVideo} />
                <video src={welcomeVideo3} autoPlay loop muted style={styles.welcomeVideo} />
            </div>
            <div style={styles.welcomeText}>Welcome to Our Store!</div>

            <ToastContainer />

            <div style={styles.filterContainer}>
            <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={handleSearch}
        style={styles.searchInput}
        onFocus={(e) => (e.target.style = { ...styles.searchInput, ...styles.searchInputFocus })}
        onBlur={(e) => (e.target.style = styles.searchInput)}
    />

    {/* Filtre de prix */}
    <div>
        <label style={styles.filterLabel}>Price:</label>
        <select
            onChange={handlePriceFilterChange}
            style={styles.filterSelect}
            onFocus={(e) => (e.target.style = { ...styles.filterSelect, ...styles.filterSelectFocus })}
            onBlur={(e) => (e.target.style = styles.filterSelect)}
        >
            <option value="all">All</option>
            <option value="20">Under $20</option>
            <option value="50">Under $50</option>
            <option value="100">Under $100</option>
        </select>
    </div>

    {/* Filtre de catégorie */}
    <div>
        <label style={styles.filterLabel}>Category:</label>
        <select
            onChange={handleCategoryFilterChange}
            style={styles.filterSelect}
            onFocus={(e) => (e.target.style = { ...styles.filterSelect, ...styles.filterSelectFocus })}
            onBlur={(e) => (e.target.style = styles.filterSelect)}
        >
            <option value="all">All Categories</option>
            <option value="Autumn">Autumn</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
        </select>
            </div>
          

            <div style={styles.productList}>
                {filteredProducts.map((product) => (
                    <div
                        key={product.productId}
                        style={styles.productCard}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <img
                            src={`${API_BASE_URL}/${product.imagePath}`}
                            alt={product.productName}
                            style={styles.productImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'path/to/fallback-image.png';
                            }}
                        />
                        <div style={styles.productDetails}>
                            <div style={styles.productName}>{product.productName}</div>
                            <div style={styles.productPrice}>${product.price}</div>
                            <button
                                style={styles.addToCart}
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ProductList;
