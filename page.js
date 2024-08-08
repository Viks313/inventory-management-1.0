"use client"
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { collection, doc, getDoc, getDocs, deleteDoc, query, setDoc, where } from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItems = async (item, quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: docSnap.data().quantity + quantity });
    } else {
      await setDoc(docRef, { quantity: quantity });
    }

    await updateInventory();
  };

  const removeItems = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filteredItems = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filteredItems);
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f0f0"
    >
      <Paper elevation={3} sx={{ width: "80%", maxWidth: "1200px" }}>
        <Grid container spacing={2} p={4}>
          <Grid item xs={12}>
            <Box
              bgcolor="#ADD8E6"
              py={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h2" color="#333" textAlign="center">
                Inventory Management
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Button variant="contained" onClick={handleOpen}>
                Add New Item
              </Button>
              <TextField
                id="search-input"
                label="Search Items"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Modal open={open} onClose={handleClose}>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bgcolor="background.paper"
                boxShadow={24}
                p={4}
                borderRadius={4}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add Item
                </Typography>
                <Stack width="100%" direction="row" spacing={2} mt={2}>
                  <TextField
                    id="outlined-basic"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItems(itemName, itemQuantity);
                      setItemName("");
                      setItemQuantity(1);
                      handleClose();
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Stack width="100%" spacing={2} overflow="auto" maxHeight="400px">
              {filteredInventory.map(({ name, quantity }) => (
                <Paper key={name} elevation={2} sx={{ padding: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="h3" color="#333" textAlign="left">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <IconButton onClick={() => addItems(name, -1)}>
                          <RemoveIcon color="error" />
                        </IconButton>
                        <Typography variant="h3" color="#333" textAlign="center">
                          {quantity}
                        </Typography>
                        <IconButton onClick={() => addItems(name, 1)}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => removeItems(name)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}