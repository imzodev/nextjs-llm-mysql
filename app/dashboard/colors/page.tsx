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
import { Color } from "@/types";
import { 
  Edit, 
  Plus, 
  Search, 
  Trash2,
  Palette
} from "lucide-react";

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "#000000",
    storeId: "default-store" // This would come from auth context in a real app
  });

  useEffect(() => {
    // Mock data for demonstration
    // In a real app, this would fetch from the API
    const mockColors = [
      { id: "1", name: "Red", value: "#FF0000", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "2", name: "Blue", value: "#0000FF", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "3", name: "Green", value: "#00FF00", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "4", name: "Yellow", value: "#FFFF00", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "5", name: "Black", value: "#000000", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
      { id: "6", name: "White", value: "#FFFFFF", storeId: "default-store", createdAt: new Date(), updatedAt: new Date() },
    ];
    
    setColors(mockColors);
    setLoading(false);
    
    // In a real app with API:
    // async function fetchColors() {
    //   try {
    //     const response = await fetch('/api/colors');
    //     const data = await response.json();
    //     
    //     if (data.success) {
    //       setColors(data.data);
    //     } else {
    //       console.error('Failed to fetch colors:', data.error);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching colors:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // 
    // fetchColors();
  }, []);

  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      value: "#000000",
      storeId: "default-store"
    });
  };

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call the API
    const newColor: Color = {
      id: `${colors.length + 1}`,
      name: formData.name,
      value: formData.value,
      storeId: formData.storeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setColors([...colors, newColor]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditColor = (color: Color) => {
    setSelectedColor(color);
    setFormData({
      name: color.name,
      value: color.value,
      storeId: color.storeId
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateColor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedColor) return;
    
    // In a real app, this would call the API
    const updatedColor = {
      ...selectedColor,
      name: formData.name,
      value: formData.value,
      updatedAt: new Date()
    };
    
    setColors(colors.map(c => 
      c.id === selectedColor.id ? updatedColor : c
    ));
    setIsEditDialogOpen(false);
    setSelectedColor(null);
    resetForm();
  };

  const handleDeleteColor = async (id: string) => {
    if (confirm('Are you sure you want to delete this color?')) {
      // In a real app, this would call the API
      setColors(colors.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Colors</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Color</DialogTitle>
              <DialogDescription>
                Create a new color for your products.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddColor}>
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
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Color
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="value"
                      name="value"
                      type="color"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                      required
                    />
                    <Input
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Color</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Color</DialogTitle>
              <DialogDescription>
                Update the color name and value.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateColor}>
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
                    Color
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="edit-value"
                      name="value"
                      type="color"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                      required
                    />
                    <Input
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Color</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color Management</CardTitle>
          <CardDescription>
            Manage product colors for your store.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colors..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading colors...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColors.length > 0 ? (
                    filteredColors.map((color) => (
                      <TableRow key={color.id}>
                        <TableCell>
                          <div 
                            className="w-8 h-8 rounded-full border" 
                            style={{ backgroundColor: color.value }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{color.name}</TableCell>
                        <TableCell>{color.value}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditColor(color)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteColor(color.id)}
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
                        No colors found
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
