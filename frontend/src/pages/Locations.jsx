import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getColleges, getDepartmentsByCollege, getLocations, createLocation, deleteLocation } from '@/lib/api';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newLocation, setNewLocation] = useState({
        location: '',
        location_name: '',
        college_id: '',
        department_id: '',
        description: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchColleges();
        fetchLocations();
    }, []);

    useEffect(() => {
        if (newLocation.college_id) {
            fetchDepartments(newLocation.college_id);
        }
    }, [newLocation.college_id]);

    const fetchColleges = async () => {
        try {
            const data = await getColleges();
            setColleges(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const fetchDepartments = async (collegeId) => {
        try {
            const data = await getDepartmentsByCollege(collegeId);
            setDepartments(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const fetchLocations = async () => {
        try {
            const data = await getLocations();
            setLocations(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        try {
            await createLocation(newLocation);
            setNewLocation({
                location: '',
                location_name: '',
                college_id: '',
                department_id: '',
                description: ''
            });
            setIsDialogOpen(false);
            fetchLocations();
            toast({
                title: 'Success',
                description: 'Location created successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteLocation = async (locationId) => {
        try {
            await deleteLocation(locationId);
            fetchLocations();
            toast({
                title: 'Success',
                description: 'Location deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Locations</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Location</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateLocation} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Location Code"
                                value={newLocation.location}
                                onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Location Name"
                                value={newLocation.location_name}
                                onChange={(e) => setNewLocation({ ...newLocation, location_name: e.target.value })}
                                required
                            />
                            <Select
                                value={newLocation.college_id}
                                onValueChange={(value) => setNewLocation({ ...newLocation, college_id: value, department_id: '' })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select College" />
                                </SelectTrigger>
                                <SelectContent>
                                    {colleges.map((college) => (
                                        <SelectItem key={college.college_id} value={college.college_id}>
                                            {college.college_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={newLocation.department_id}
                                onValueChange={(value) => setNewLocation({ ...newLocation, department_id: value })}
                                disabled={!newLocation.college_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department.department_id} value={department.department_id}>
                                            {department.department_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Textarea
                                placeholder="Description"
                                value={newLocation.description}
                                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                            />
                            <Button type="submit">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location ID</TableHead>
                        <TableHead>Location Code</TableHead>
                        <TableHead>Location Name</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {locations.map((location) => (
                        <TableRow key={location.location_id}>
                            <TableCell>{location.location_id}</TableCell>
                            <TableCell>{location.location}</TableCell>
                            <TableCell>{location.location_name}</TableCell>
                            <TableCell>{location.college_name}</TableCell>
                            <TableCell>{location.department_name}</TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteLocation(location.location_id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Locations; 