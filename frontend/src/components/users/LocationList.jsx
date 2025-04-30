import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/lib/api";

const locationSchema = z.object({
  location: z.string().min(1, "Location number is required"),
  location_name: z.string().min(1, "Location name is required"),
  college_id: z.string().min(1, "College is required"),
  department_id: z.string().optional(),
  description: z.string().optional(),
});

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: "",
      location_name: "",
      college_id: "",
      department_id: "",
      description: "",
    },
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const locationsData = await getLocations();
      console.log('Locations:', locationsData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch locations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.location_id, data);
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        await createLocation(data);
        toast({
          title: "Success",
          description: "Location created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingLocation(null);
      form.reset();
      fetchLocations();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save location",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    form.reset({
      location: location.location,
      location_name: location.location_name,
      college_id: location.college_id,
      department_id: location.department_id || "",
      description: location.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (locationId) => {
    try {
      await deleteLocation(locationId);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
      fetchLocations();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (locations.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No locations found or failed to load data.</p>
        <Button onClick={() => setIsDialogOpen(true)}>Add Location</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add New Location"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="college_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department ID (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingLocation(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLocation ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Location Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>College ID</TableHead>
              <TableHead>Department ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.location_id}>
                <TableCell>{location.location_id}</TableCell>
                <TableCell>{location.location}</TableCell>
                <TableCell>{location.location_name}</TableCell>
                <TableCell>{location.college_id}</TableCell>
                <TableCell>{location.department_id || "-"}</TableCell>
                <TableCell>{location.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(location.location_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LocationList;