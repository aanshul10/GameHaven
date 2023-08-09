import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, products: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };       
      default:
        return state;
    }
  };

  const categories = ["All", "First-person shooter","Action-adventure", 
   "Sports", "Role-playing", "Platform", "Simulation" ];
  
  function Products() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
      products: [],
      loading: true,
      error: "",
    });

    const [selectedCategory, setSelectedCategory] = useState("All");
    // const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
      const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
          const endpoint = selectedCategory === "All" ? "/api/products" : `/api/products/category/${selectedCategory}`;
          const result = await axios.get(endpoint);
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: err.message });
        }
      };
      fetchData();
    }, [selectedCategory]);  // Fetch products whenever the selected category changes


    //useEffect(() => {
      //const fetchData = async () => {
       // dispatch({ type: "FETCH_REQUEST" });
       // try {
        //  const result = await axios.get("/api/products");
        //  dispatch({ type: "FETCH_SUCCESS", payload: result.data });
       // } catch (err) {
       //   dispatch({ type: "FETCH_FAIL", payload: err.message });
       // }
  
        // setProducts(result.data);
      //};
     // fetchData();
   // }, []);

      return (
        <Container className="mt-3">
          <Typography 
                    variant="h4" 
                    align="center" 
                    style={{
                        fontFamily: "'Chilly', cursive, sans-serif",
                        color: 'black',
                        fontSize: '2rem'
                    }}
                >
                    {selectedCategory === "All" ? "Products" : selectedCategory}
                </Typography>
          <FormControl>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product.slug} xs={12} sm={6} md={4} lg={3} className="mb-3">
                            <Product product={product}></Product>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

    export default Products;