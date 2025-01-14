import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addProduct, getAllProducts, deleteProduct, updateProduct } from '../services/productService';
import SearchIcon from '@mui/icons-material/Search';

const BASE_URL = 'http://localhost:8080';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        imageFile: null,
        imagePath: '',
        category:'',
        description:''
    });

    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        setProduct({ ...product, imageFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('category', product.category);
        formData.append('description', product.description);
        if (product.imageFile) {
            formData.append('image', product.imageFile);
        }
    
        console.log("------ Form Data Content Being Sent to Backend ------");
    
        // Log each entry in formData for clarity
        formData.forEach((value, key) => {
            if (key === 'image' && value instanceof File) {
                console.log(`${key}: [File] name=${value.name}, type=${value.type}, size=${value.size}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });
    
        console.log("----------------------------------------------------");
    
        try {
            if (editingProductId) {
                await updateProduct(editingProductId, formData);
            } else {
                await addProduct(formData);
            }
            fetchProductList();
            clearForm();
        } catch (error) {
            console.error('Error adding/updating product:', error);
        }
    };
    
    

    const handleDelete = async (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await deleteProduct(productId);
                alert('Produit supprimé avec succès');
                fetchProductList();
            } catch (error) {
                console.error('Erreur lors de la suppression du produit', error);
            }
        }
    };

    const handleEdit = (product) => {
        setProduct({
            name: product.productName,
            price: product.price,
            quantity: product.quantity,
            imageFile: null,
            imagePath: product.imagePath,
            category:product.category,
            description: product.description
           
        });
        setEditingProductId(product.productId);
        setFormVisible(true);
    };

    const fetchProductList = async () => {
        try {
            const products = await getAllProducts();
            setProducts(products);
            console.log("Products received:", products);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits', error);
            
        }
    };

    const [categoryFilter, setCategoryFilter] = useState(''); // Added for category filter



    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            quantity: '',
            description:'',
            category:'',
            imageFile: null,
            imagePath: ''
        });
        setEditingProductId(null);
        setFormVisible(false);
    };

    useEffect(() => {
        fetchProductList();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = !priceFilter || product.price <= Number(priceFilter);
        const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter.toLowerCase();
        console.log(`matchesCategory (${categoryFilter}):`, matchesCategory);
        return matchesSearch && matchesPrice && matchesCategory;
    });

    const styles = {
        body: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'rgb(245, 245, 227)',
            fontFamily: 'Times New Roman',
        },
        container: {
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            backgroundColor: 'rgb(245, 245, 227)',
            fontFamily: 'Times New Roman',
        },
        form: {
            marginBottom: '20px',
            backgroundColor: '#ffffff',
            padding: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '300px',
            fontFamily: 'Times New Roman',
        },
        cardContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            
            fontFamily: 'Times New Roman',
        },
        card: {
            fontFamily: 'Times New Roman',
        width: '140px',
        height: '220px',
        margin: '10px',
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.61)",
        transition: 'transform 0.3s ease',
        },
        cardImage: {
            width: '130px',
            height: '130px',
            objectFit: 'cover',
            marginTop:'0px',
            padding:'4px'
        },
        actionBtnEdit: {
            padding: '2px 6px 2p 2px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '9px',
            marginRight: '6px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.2s',
            fontFamily: 'Times New Roman',
            marginLeft:'4px'
        },
        actionBtnDelete: {
            padding: '2px 6px 2p 2px',
            backgroundColor: 'rgba(230,4,4,0.75)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'Times New Roman',
            fontSize: '9px',
            marginRight: '6px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.2s',
        },
        formInput: {
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '9px',
        },
        formLabel: {
            marginBottom: '0px',
            fontWeight: 'bold',
            fontSize: '12px',
            fontFamily: 'Times New Roman',
        },
        title: {
            fontFamily: 'Times New Roman',
        padding: '0px 5px 0px',
        
        textAlign: 'left',
        fontFamily: 'Times New Roman',
        fontSize: '10px',
        marginTop:"0px",
        marginBottom:"0px"
        
        },
        addButton: {
            width: '90px',
            backgroundColor: '  #ffd800',
            color: 'black',
            padding: '0px',
            borderRadius: '5px',
            border: 'none',
            marginBottom: "6px",
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s, transform 0.3s',
            fontSize: "9px",
            fontFamily: 'Times New Roman',
        },
        cancelButton: {
            width: '90px',
            backgroundColor: 'red', // Couleur rouge vif
            color: 'white',
            padding: '3px 3px 3px 3px',
            borderRadius: '5px',
            border: 'none',
            marginBottom: "6px",
            marginLeft: "35%", // Ajoute un espace entre les boutons
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s, transform 0.3s',
            fontSize: "9px",
            fontFamily: 'Times New Roman',
        },
        filterContainer: {
            display: 'flex',
            marginBottom: '10px',
            padding: '4px',
        },
        categoryFilter: {
            marginLeft: '150px ',
            fontSize: '9px',
            padding: '4px',
            width: '200px'
        },
        searchInput: {
            fontSize: "9px",
            fontFamily: 'Times New Roman',
            width: '200px',
            backgroundColor: '#ffffff',
            padding: '4px',
        },
        priceInput: {
            marginLeft: "300px",
            fontSize: "9px",

            fontFamily: 'Times New Roman',
            width: '150px',
            backgroundColor: '#ffffff',
            padding: '4px',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <div style={styles.filterContainer}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <SearchIcon style={{ color: 'black' }} />
                        <input
                            style={styles.searchInput}
                            type="text"
                            placeholder="Rechercher un produit"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
 <select
    style={styles.categoryFilter}
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
>
    <option value="">Toutes les catégories</option>
    <option value="Summer">Summer</option>
    <option value="Winter">Winter</option>
    <option value="Autumn">Autumn</option>
    <option value="Spring">Spring</option>
</select>
                    </div>
                    <div>
                   

                        <label style={styles.formLabel}></label>
                        <input
                            style={styles.priceInput}
                            type="number"
                            placeholder="Price"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    onClick={() => setFormVisible(true)}
                    style={styles.addButton}
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
                {formVisible && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <h4 style={styles.title}>Add a product</h4>
                        <label style={styles.formLabel}>Product Name:</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                        />
                        <label style={styles.formLabel}>Price:</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                        />
                        <label style={styles.formLabel}>Quantity:</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleInputChange}
                        />

<label style={styles.formLabel}>Description:</label>
<textarea
    style={styles.formInput}
    name="description"
    value={product.description}
    onChange={handleInputChange}
/>

<label style={styles.formLabel}>Category:</label>
<select
    style={styles.formInput}
    name="category"
    value={product.category}
    onChange={handleInputChange}
>
    <option value="">Select a Category</option>
    <option value="Summer">Summer</option>
    <option value="Winter">Winter</option>
    <option value="Autumn">Autumn</option>
    <option value="Spring">Spring</option>
</select>
                        <label style={styles.formLabel}>Image:</label>
                        <input
                            style={styles.formInput}
                            type="file"
                            onChange={handleFileChange}
                        />
                        <div>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<AddIcon />}
                                style={styles.addButton}
                            >
                                {editingProductId ? 'Mettre à jour Produit' : 'Add'}
                            </Button>
                            <Button
                                type="button"
                                onClick={clearForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                <div style={styles.cardContainer}>
                    {filteredProducts.map(product => (
                        <div key={product.productId} style={styles.card}>
                            <img src={`${BASE_URL}/${product.imagePath}`} alt={product.productName} style={styles.cardImage} />
                            <h4 style={styles.title}>{product.productName}</h4>
                            <p style={styles.title}>price: {product.price} $</p>
                            <p style={styles.title}>quantity: {product.quantity}</p>
                            <p style={styles.title}> {product.description}</p>
                            
                            <button
                                style={styles.actionBtnEdit}
                                onClick={() => handleEdit(product)}
                            >
                                Edit
                            </button>
                            <button
                                style={styles.actionBtnDelete}
                                onClick={() => handleDelete(product.productId)}
                            >
                                Delete
                               
            </button>
        </div>
    ))}
</div>
</div>
</div>
);
};

export default AddProduct;

    
