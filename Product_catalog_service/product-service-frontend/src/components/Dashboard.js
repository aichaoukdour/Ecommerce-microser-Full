import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, Grid, Divider, Box } from '@mui/material';
import { Circle } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Icône pour Summer
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Icône pour Winter
import SpaIcon from '@mui/icons-material/Spa'; // Icône pour Spring
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Icône pour Autumn
import { AreaChart, Area } from 'recharts';
import { FaFemale, FaMale } from 'react-icons/fa'; // Import icons from react-icons/fa
import { Button } from 'react-bootstrap';

import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar
} from 'recharts';


function Dashboard() {
    const [productCount, setProductCount] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [sales, setSales] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [clients, setClients] = useState([
        { name: 'John ', activity: 'Active', color: 'rgb(171, 241, 169)' },
        { name: 'Jane ', activity: 'Inactive', color: 'rgb(255, 181, 181)' },
        { name: 'Tom ', activity: 'Active', color: 'rgb(207, 253, 201)' },
        { name: 'Emily ', activity: 'Inactive', color: 'rgb(252, 171, 171)' },
    ]);
   // Sample data for gender distribution
const genderData = {
    femalePercentage: 60, // 60% female users
    malePercentage: 40,   // 40% male users
};
    const categories = [
        { name: 'Summer', income: 3200 },
        { name: 'Winter', income: 200 },
        { name: 'Autumn', income: 350 },
        { name: 'Spring', income: 1050 },
        {  income: 250 },

    ];
    const ordersData = [
        { name: 'Pending', value: 400 },
        { name: 'Paid', value: 300 },
        { name: 'Canceled', value: 200 },
      ];
      
      const COLORS = ['rgb(198, 133, 42)', 'rgb(57, 96, 30)', 'rgb(172, 58, 49)']; // Colors for each segment
    
    const salesData = [
        { month: 'Jan', sales: 400 },
        { month: 'Feb', sales: 300 },
        { month: 'Mar', sales: 200 },
        { month: 'Apr', sales: 278 },
        { month: 'May', sales: 189 },
        { month: 'Jun', sales: 239 },
        { month: 'Jul', sales: 349 },
        { month: 'Aug', sales: 200 },
        { month: 'Sep', sales: 300 },
        { month: 'Oct', sales: 400 },
        { month: 'Nov', sales: 250 },
        { month: 'Dec', sales: 300 },
    ];
    

    const chartData = categories.map((category, index) => ({
        key: `key-${index}`, // Clé unique
        name: category.name,
        value: category.income,
        icon:
            category.name === "Summer" ? <WbSunnyIcon style={{ fontSize: '40px', color: 'gold' }} /> :
            category.name === "Winter" ? <AcUnitIcon style={{ fontSize: '40px', color: 'skyblue' }} /> :
            category.name === "Spring" ? <SpaIcon style={{ fontSize: '40px', color: 'green' }} /> :
            category.name === "Autumn" ? <LocalFloristIcon style={{ fontSize: '40px', color: 'orange' }} /> :
            null,
        color:
            category.income > 2000
                ? 'rgb(110, 254, 0)' // Vert vif pour les revenus > 2000
                : category.income === 350
                    ? 'rgb(14, 119, 210)' // Bleu pour 350
                    : category.income === 200
                        ? 'rgb(6, 65, 54)' // Vert foncé pour 200
                        : category.income === 1050
                            ? 'rgb(255, 165, 0)' // Orange pour 1050
                            : 'rgb(103, 103, 103)', // Gris par défaut
    }));
    const handleZoomIn = () => setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
    const handleZoomOut = () => setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5));

    
    

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/product');
                const data = await response.json();
                setProductCount(data.length);
            } catch (error) {
                console.error('Error fetching product count:', error);
            }
        };

        const fetchEarnings = async () => {
            try {
                const response = await fetch('http://localhost:8080/earnings');
                const data = await response.json();
                setEarnings(data.totalEarnings);
            } catch (error) {
                console.error('Error fetching earnings:', error);
            }
        };

        const fetchSales = async () => {
            try {
                const response = await fetch('http://localhost:8080/sales');
                const data = await response.json();
                setSales(data.totalSales);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        const fetchCartCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/cart/count');
                const data = await response.json();
                setCartCount(data.count);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };
        

        fetchProductCount();
        fetchEarnings();
        fetchSales();
        fetchCartCount();
    }, []);

    const styles = {
        containerStyle: {
            padding: '10px',
            borderRadius: '20px',
            width:'100%',
            marginLeft:"-50px",
            backgroundColor: 'rgb(245, 245, 227)',
        },
        dashboardTitle: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#2e3b4e',
            marginBottom: '15px',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
            },
        },
        pieChartCard: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            background: 'rgba(252, 252, 228, 0.8)',
            height: '100%',
        },
        clientCard: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'rgb(254, 254, 238)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            },
        },
        activeStatus: {
            color: 'rgb(184, 248, 175)',
            marginRight: '20px',
        },
        inactiveStatus: {
            color: 'rgb(253, 156, 156)',
            marginRight: '20px',
        },
        clientName: {
            fontSize: '16px',
            color: '#333',
        },
        divider: {
            margin: '15px 0',
        },
        sectionRight: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '15px',
        },
        leftSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
        },
        productCard: {
            background: 'rgba(216, 216, 202, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            padding: '15px',
            width:'86%',
           
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '1 8px 16px rgba(0, 0, 0, 0.2)',
            },
        },

        earningsCard: {
            background: 'rgba(216, 216, 202, 0.9)',
            marginLeft:'1px',
            width:'86%',
            borderRadius: '10px',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            borderRadius: '10px',
            padding: '15px',
           
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
        },
        zoomButton: {
            marginTop: '20px',
            backgroundColor: '#0088FE',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            '&:hover': {
                backgroundColor: '#005fa3',
            },
        },

        
        salesCard: {
            width:'86%',
            marginBottom:'50%',
            background: 'rgba(216, 216, 202, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            padding: '15px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
        },
        salesChartCard: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 15px rgb(10, 9, 6)',
            background: 'rgba(252, 252, 228, 0.8)',
            height: '100%',
            marginTop:'-20%',
            padding: '20px',
            borderRadius: '15px',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
            },
        },
        
    };

    return (
        <Container style={styles.containerStyle}>
            <Typography variant="h4" style={styles.dashboardTitle}>
                Dashboard
            </Typography>

            {/* Main Grid Layout */}
            <Grid container spacing={3}>
            
                    
                        
    {/* Left section for product, earnings, and sales (horizontal layout) */}
    <Grid item xs={12} md={8} style={styles.leftSection}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
            <Card style={styles.productCard}>
                                <StorefrontIcon style={{ fontSize: 20, alignItems:'center',marginLeft:"55px", color: '#0088FE' }} />
                                <Typography fontSize="10px" style={{ textAlign: 'center'}}>Product</Typography>
                                <Typography variant="40px" style={{ textAlign: 'center',marginLeft:"60px" , fontWeight: '600' }}>{productCount}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card style={styles.earningsCard}>
                                <AttachMoneyIcon style={{ fontSize: 20, alignItems:'center',marginLeft:"55px",  color: '#00C49F' }} />
                                <Typography fontSize="10px" style={{ textAlign: 'center',}}>Earnings</Typography>
                                <Typography variant="40px" style={{ textAlign: 'center',marginLeft:"60px", fontWeight: '600'}}>${earnings}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card style={styles.salesCard}>
                                <ShoppingCartIcon style={{ fontSize: 20, alignItems:'center',marginLeft:"55px",  color: '#FFBB28' }} />
                                <Typography fontSize="10px" style={{ textAlign: 'center'}}>Sales</Typography>
                                <Typography variant="40px" style={{ textAlign: 'center',marginLeft:"60px" , fontWeight: '600'}}>{sales}</Typography>
                            </Card>
            </Grid>
            <Grid item xs={12} md={8}>
    <Card style={styles.salesChartCard}>
        <Typography variant="h6" style={{ marginBottom: '10px',marginTop: '10px', textAlign: 'center' }}>
            Sales Over the Months
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    </Card>
</Grid>
<Grid item xs={12} md={6} lg={4}> {/* Adjust the grid size based on screen size */}
            <Card
                style={{
                    padding: '10px',
                    marginTop: '-38%',
                    height: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 8px 15px rgb(10, 9, 6)',
            background: 'rgba(252, 252, 228, 0.8)',
                }}
            >
                <Typography
                    fontSize="10px"
                    style={{ marginBottom: '10px', textAlign: 'center' }}
                >
                    Orders status over the Months
                </Typography>

                <ResponsiveContainer width="100%" height={250}> {/* Control height for better resizing */}
                    <PieChart>
                        <Pie
                            data={ordersData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%" // Center horizontally
                            cy="50%" // Center vertically
                            outerRadius="70%" // Adjust the outer radius for size
                            label
                        >
                            {ordersData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                {/* Add additional information below the chart */}
                <Typography
                    variant="body2"
                    style={{
                        marginTop: '-10px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: ' #555',
                    }}
                >
                    Pending: {ordersData[0].value} | Paid: {ordersData[1].value} | Canceled: {ordersData[2].value}
                </Typography>
            </Card>
        </Grid>
        <Grid container spacing={3}>
            {/* Female Users Card */}
            <Grid item xs={12} md={6} lg={3}>
                <Card
                    style={{
                        padding: '20px',
                        display: 'flex',
                        marginTop:'5px',
                        marginLeft:'20px',
                        marginRight:'-20px',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        boxShadow: '0 8px 15px rgb(10, 9, 6)',
                      
                    }}
                >
                    <FaFemale size={50} color="rgb(169, 42, 84)" />
                    <Typography fontSize="10px" style={{ marginTop: '10px' }}>
                        Female Clients
                    </Typography>
                    <Box
                        style={{
                            marginTop: '10px',
                            backgroundColor: 'rgb(188, 14, 72)',
                            boxShadow: '0 8px 15px rgb(10, 9, 6)',
                           
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        {genderData.femalePercentage}%
                    </Box>
                </Card>
            </Grid>

            {/* Male Users Card */}
            <Grid item xs={12} md={6} lg={3}>
                <Card
                    style={{
                        padding: '20px',
                        display: 'flex',
                        marginLeft:'10px',
                        marginTop:'5px',
                        marginRight:'-20px',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: ' #f5f5f5',
                        boxShadow: '0 8px 15px rgb(10, 9, 6)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                    }}
                >
                    <FaMale size={50} color="rgb(3, 66, 118)" />
                    <Typography fontSize="10px" style={{ marginTop: '10px'  }}>
                        Male Clients
                    </Typography>
                    <Box
                        style={{
                            marginTop: '10px',
                            backgroundColor: 'rgb(4, 83, 147)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            boxShadow: '0 8px 15px rgb(10, 9, 6)',
                            
                            fontWeight: 'bold',
                        }}
                    >
                        {genderData.malePercentage}%
                    </Box>
                </Card>
            </Grid>
        </Grid>
        </Grid>
    </Grid>
    
    {/* Right section for clients, pie chart, and cart */}
    <Grid item xs={12} md={4}>
        
        <Card style={styles.card}>
            
        <Divider style={styles.divider} />
            <Typography fontSize="20px"  style={{ marginLeft:'-50%',marginTop:'-10%', fontWeight:'900' }}> $ 234 567</Typography>
            <Typography fontSize="10px"  style={{ marginLeft:'-65%', color:"rgb(103, 99, 99)"}}>Incomes</Typography>
           
           {/* Add subtle line between Incomes and Clients */}
<Divider style={{ margin: '10px 0', borderColor: 'rgba(0, 0, 0, 0.2)', width: '80%' }} />

<Divider style={styles.divider} />
            <Typography  fontSize="13px"  style={{ marginLeft:'-35.5%',marginTop:'-6%', fontWeight:'400' }}>Income by Category</Typography>
            <PieChart width={250} height={250}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={80}
                    fill="rgb(199, 216, 132)"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <text
                x="50%"
                y="50%"
                textAnchor="middle"
                style={{
                    fontSize: '20px',
                    marginTop:"-10%",
                    fill: '#333',
                }}
            >
                $ 2345.00
            </text>
                <Tooltip />
                <Legend />
            </PieChart>
            <Divider style={{ margin: '30px 0', borderColor: 'rgba(0, 0, 0, 0.2)', width: '80%' }} />

            <Typography fontSize="13px"  style={{ marginLeft:'-60%',marginTop:'-6%', marginButtom:'%',fontWeight:'400' }}>Clients</Typography>
            <Divider style={styles.divider} />
            <Box display="flex" flexDirection="column" gap="10px">
                {clients.map((client, index) => (
                    <Card key={index} style={styles.clientCard}>
                        <div style={{ display: 'flex', alignItems: 'center' ,marginTop:'-10px' }}>
                            <Circle style={client.activity === 'Active' ? styles.activeStatus : styles.inactiveStatus} />
                            <Typography style={styles.clientName}>{client.name}</Typography>
                        </div>
                    
                    </Card>
                ))}
            </Box>
           
            </Card>
    </Grid>
</Grid>

        </Container>
    );
}

export default Dashboard;
