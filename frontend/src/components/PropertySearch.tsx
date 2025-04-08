import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import axios from 'axios';

interface Property {
  _id: string;
  name: string;
  location: string;
  totalSqftAvailable: number;
  pricePerSqft: number;
  totalPrice: number;
  threeYear?: number;
  fiveYear?: number;
  sevenYear?: number;
}

const PropertySearch = () => {
  const [searchType, setSearchType] = useState<'one-time' | 'monthly'>('one-time');
  const [budget, setBudget] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/search', {
        type: searchType,
        budget: parseFloat(budget),
      });
      setProperties(response.data);
    } catch (err) {
      setError('Error searching for properties. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search Properties
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Search Type</InputLabel>
              <Select
                value={searchType}
                label="Search Type"
                onChange={(e) => setSearchType(e.target.value as 'one-time' | 'monthly')}
              >
                <MenuItem value="one-time">One-time Investment</MenuItem>
                <MenuItem value="monthly">Monthly Payment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading || !budget}
              fullWidth
            >
              {loading ? 'Searching...' : 'Search Properties'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {property.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  Total Area: {property.totalSqftAvailable} sq.ft
                </Typography>
                <Typography variant="body2" paragraph>
                  Price per sq.ft: {formatCurrency(property.pricePerSqft)}
                </Typography>
                <Typography variant="body2" paragraph>
                  Total Price: {formatCurrency(property.totalPrice)}
                </Typography>
                {searchType === 'monthly' && (
                  <Box>
                    <Typography variant="body2">
                      3 Year EMI: {formatCurrency(property.threeYear || 0)}
                    </Typography>
                    <Typography variant="body2">
                      5 Year EMI: {formatCurrency(property.fiveYear || 0)}
                    </Typography>
                    <Typography variant="body2">
                      7 Year EMI: {formatCurrency(property.sevenYear || 0)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PropertySearch; 