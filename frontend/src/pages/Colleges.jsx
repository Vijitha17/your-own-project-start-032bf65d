import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createCollege, getAllColleges, updateCollege, deleteCollege } from '@/lib/api';

const Colleges = () => {
    const [colleges, setColleges] = useState([]);
    const [newCollege, setNewCollege] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const data = await getAllColleges();
            setColleges(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCreateCollege = async (e) => {
        e.preventDefault();
        try {
            await createCollege({ college_name: newCollege });
            setNewCollege('');
            setIsDialogOpen(false);
            fetchColleges();
            toast({
                title: 'Success',
                description: 'College created successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteCollege = async (collegeId) => {
        try {
            await deleteCollege(collegeId);
            fetchColleges();
            toast({
                title: 'Success',
                description: 'College deleted successfully',
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
                <h1 className="text-2xl font-bold">Colleges</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add College</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New College</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateCollege} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="College Name"
                                value={newCollege}
                                onChange={(e) => setNewCollege(e.target.value)}
                                required
                            />
                            <Button type="submit">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>College ID</TableHead>
                        <TableHead>College Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {colleges.map((college) => (
                        <TableRow key={college.college_id}>
                            <TableCell>{college.college_id}</TableCell>
                            <TableCell>{college.college_name}</TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteCollege(college.college_id)}
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

export default Colleges; 