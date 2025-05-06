import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CurrentStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Fetch current stock data from API
    // For now, using dummy data
    setStocks([
      {
        id: 1,
        item_name: "Laptop",
        category: "Electronics",
        quantity: 10,
        location: "IT Department",
        status: "Available"
      },
      {
        id: 2,
        item_name: "Printer",
        category: "Electronics",
        quantity: 5,
        location: "Admin Office",
        status: "Available"
      }
    ]);
    setLoading(false);
  }, []);

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log("Edit stock item:", id);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log("Delete stock item:", id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.item_name}</TableCell>
                <TableCell>{stock.category}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>{stock.location}</TableCell>
                <TableCell>{stock.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(stock.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(stock.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CurrentStock; 