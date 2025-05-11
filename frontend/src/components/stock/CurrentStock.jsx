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
    // Sample data with more than 20 records
    const sampleStocks = [
      { id: "ITM-1001", item_name: "Dell XPS 15 Laptop", category: "Electronics", status: "Available" },
      { id: "ITM-1002", item_name: "HP LaserJet Printer", category: "Electronics", status: "Available" },
      { id: "ITM-1003", item_name: "Logitech Wireless Mouse", category: "Electronics", status: "Available" },
      { id: "ITM-1004", item_name: "Ergonomic Office Chair", category: "Furniture", status: "Low Stock" },
      { id: "ITM-1005", item_name: "Whiteboard 4x6 ft", category: "Office Supplies", status: "Available" },
      { id: "ITM-1006", item_name: "Projector Epson EB-980", category: "Electronics", status: "Available" },
      { id: "ITM-1007", item_name: "Stapler Heavy Duty", category: "Office Supplies", status: "Available" },
      { id: "ITM-1008", item_name: "Filing Cabinet 2-Drawer", category: "Furniture", status: "Available" },
      { id: "ITM-1009", item_name: "Coffee Machine", category: "Appliances", status: "Maintenance Needed" },
      { id: "ITM-1010", item_name: "Monitor 24-inch", category: "Electronics", status: "Available" },
      { id: "ITM-1011", item_name: "Keyboard Mechanical", category: "Electronics", status: "Available" },
      { id: "ITM-1012", item_name: "Desk Lamp LED", category: "Furniture", status: "Available" },
      { id: "ITM-1013", item_name: "Notebooks (Pack of 10)", category: "Office Supplies", status: "Available" },
      { id: "ITM-1014", item_name: "Paper Shredder", category: "Office Equipment", status: "Available" },
      { id: "ITM-1015", item_name: "Water Dispenser", category: "Appliances", status: "Available" },
      { id: "ITM-1016", item_name: "Desk Organizer Set", category: "Office Supplies", status: "Available" },
      { id: "ITM-1017", item_name: "Air Purifier", category: "Appliances", status: "Available" },
      { id: "ITM-1018", item_name: "Whiteboard Markers (Set of 8)", category: "Office Supplies", status: "Available" },
      { id: "ITM-1019", item_name: "Document Scanner", category: "Electronics", status: "Available" },
      { id: "ITM-1020", item_name: "Conference Phone", category: "Electronics", status: "Available" },
      { id: "ITM-1021", item_name: "Office Plants", category: "Decor", status: "Available" },
      { id: "ITM-1022", item_name: "Fire Extinguisher", category: "Safety Equipment", status: "Available" },
      { id: "ITM-1023", item_name: "First Aid Kit", category: "Safety Equipment", status: "Expired" },
      { id: "ITM-1024", item_name: "Steel Bookcase", category: "Furniture", status: "Available" }
    ];

    setStocks(sampleStocks);
    setLoading(false);
  }, []);

  const handleEdit = (id) => {
    toast({
      title: "Edit Item",
      description: `Editing item with ID: ${id}`,
      variant: "default",
    });
    console.log("Edit stock item:", id);
  };

  const handleDelete = (id) => {
    toast({
      title: "Delete Item",
      description: `Are you sure you want to delete item ${id}?`,
      variant: "destructive",
      action: (
        <Button 
          variant="destructive" 
          onClick={() => {
            setStocks(stocks.filter(item => item.id !== id));
            toast({
              title: "Deleted",
              description: `Item ${id} has been deleted.`,
              variant: "default",
            });
          }}
        >
          Confirm Delete
        </Button>
      ),
    });
    console.log("Delete stock item:", id);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading stock data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell className="font-medium">{stock.id}</TableCell>
                <TableCell>{stock.item_name}</TableCell>
                <TableCell>{stock.category}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    stock.status === "Available" ? "bg-green-100 text-green-800" :
                    stock.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                    stock.status === "Maintenance Needed" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {stock.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1">
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
                    <Trash2 className="h-4 w-4 text-red-600" />
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