"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Size } from "@/types";
import { 
  Edit, 
  Plus, 
  Search, 
  Trash2,
  Ruler
} from "lucide-react";

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    storeId: "default-store" // This would come from auth context in a real app
  });

  useEffect(() => {
    // Mock data for demonstration
    // In a real app, this would fetch from the API
    const mockSizes = [
      { id: "1", name: "Small", value: "S", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "2", name: "Medium", value: "M", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "3", name: "Large", value: "L", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "4", name: "Extra Large", value: "XL", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "5", name: "Double Extra Large", value: "XXL", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
    ];
    
    setSizes(mockSizes);
    setLoading(false);
    
    // In a real app with API:
    // async function fetchSizes() {
    //   try {
    //     const response = await fetch('/api/sizes');
    //     const data = await response.json();
    //     
    //     if (data.success) {
    //       setSizes(data.data);
    //     } else {
    //       console.error('Failed to fetch sizes:', data.error);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching sizes:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // 
    // fetchSizes();
  }, []);

  const filteredSizes = sizes.filter(size => 
    size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    size.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      storeId: "default-store"
    });
  };

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call the API
    const newSize: Size = {
      id: `${sizes.length + 1}`,
      name: formData.name,
      value: formData.value,
      storeId: formData.storeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSizes([...sizes, newSize]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSize = (size: Size) => {
    setSelectedSize(size);
    setFormData({
      name: size.name,
      value: size.value,
      storeId: size.storeId
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSize) return;
    
    // In a real app, this would call the API
    const updatedSize = {
      ...selectedSize,
      name: formData.name,
      value: formData.value,
      updatedAt: new Date()
    };
    
    setSizes(sizes.map(s => 
      s.id === selectedSize.id ? updatedSize : s
    ));
    setIsEditDialogOpen(false);
    setSelectedSize(null);
    resetForm();
  };

  const handleDeleteSize = async (id: string) => {
    if (confirm('Are you sure you want to delete this size?')) {
      // In a real app, this would call the API
      setSizes(sizes.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sizes</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Size
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Size</DialogTitle>
              <DialogDescription>
                Create a new size for your products.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSize}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g. Small"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g. S"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Size</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Size</DialogTitle>
              <DialogDescription>
                Update the size name and value.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSize}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="edit-value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Size</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Size Management</CardTitle>
          <CardDescription>
            Manage product sizes for your store.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sizes..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading sizes...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((size) => (
                      <TableRow key={size.id}>
                        <TableCell className="font-medium">{size.name}</TableCell>
                        <TableCell>
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                            {size.value}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(size.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditSize(size)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteSize(size.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No sizes found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
