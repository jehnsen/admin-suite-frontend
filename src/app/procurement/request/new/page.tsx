"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2, Loader2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { employees } from "@/lib/data/personnel";
import { formatCurrency } from "@/lib/utils";
import { procurementService, PRItem } from "@/lib/api/services";

// Temporary interface for Form State (values as strings for inputs)
interface PRItemFormState {
  id: string; // temp ID for UI list
  item_code: string;
  item_description: string;
  specifications: string;
  unit_of_measure: string;
  quantity: string;
  unit_cost: string;
  category: string;
  stock_on_hand: string;
  monthly_consumption: string;
}

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  
  // Initialize form with today's date
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    pr_date: today,
    date_needed: "",
    requested_by: "",
    department: "",
    section: "",
    purpose: "",
    fund_source: "",
    fund_cluster: "",
    ppmp_reference: "",
    procurement_mode: "",
    estimated_budget: "",
    delivery_location: "Supply Office",
    terms_and_conditions: ""
  });

  const [items, setItems] = useState<PRItemFormState[]>([
    {
      id: "1",
      item_code: "",
      item_description: "",
      specifications: "",
      unit_of_measure: "",
      quantity: "1",
      unit_cost: "",
      category: "",
      stock_on_hand: "0",
      monthly_consumption: "0"
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        item_code: "",
        item_description: "",
        specifications: "",
        unit_of_measure: "",
        quantity: "1",
        unit_cost: "",
        category: "",
        stock_on_hand: "0",
        monthly_consumption: "0"
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PRItemFormState, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const cost = parseFloat(item.unit_cost) || 0;
      return sum + qty * cost;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic Validation
    const newErrors: Record<string, string> = {};
    if (!formData.requested_by) newErrors.requested_by = "Required";
    if (!formData.purpose) newErrors.purpose = "Required";
    if (!formData.fund_source) newErrors.fund_source = "Required";
    if (!formData.procurement_mode) newErrors.procurement_mode = "Required";
    if (!formData.pr_date) newErrors.pr_date = "Required";

    // Item Validation
    items.forEach((item, index) => {
      if (!item.item_description) newErrors[`item_${index}_desc`] = "Description required";
      if (!item.quantity || parseFloat(item.quantity) <= 0) newErrors[`item_${index}_qty`] = "Invalid Qty";
      if (!item.unit_cost || parseFloat(item.unit_cost) < 0) newErrors[`item_${index}_cost`] = "Invalid Cost";
      if (!item.unit_of_measure) newErrors[`item_${index}_uom`] = "Unit required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const totalAmount = calculateTotal();

    // Map to API Payload (Snake Case matching DB)
    const payload: any = {
        pr_date: formData.pr_date,
        date_needed: formData.date_needed || null,
        requested_by: parseInt(formData.requested_by),
        department: formData.department,
        section: formData.section,
        purpose: formData.purpose,
        fund_source: formData.fund_source,
        fund_cluster: formData.fund_cluster,
        ppmp_reference: formData.ppmp_reference,
        procurement_mode: formData.procurement_mode,
        estimated_budget: parseFloat(formData.estimated_budget) || 0,
        total_amount: totalAmount,
        delivery_location: formData.delivery_location,
        terms_and_conditions: formData.terms_and_conditions,
        status: 'Draft',
        
        // Map Items
        items: items.map((item, index) => ({
            item_number: index + 1,
            item_code: item.item_code,
            item_description: item.item_description,
            specifications: item.specifications,
            unit_of_measure: item.unit_of_measure,
            quantity: parseFloat(item.quantity),
            unit_cost: parseFloat(item.unit_cost),
            total_cost: parseFloat(item.quantity) * parseFloat(item.unit_cost),
            category: item.category,
            stock_on_hand: parseInt(item.stock_on_hand) || 0,
            monthly_consumption: parseInt(item.monthly_consumption) || 0,
        }))
    };

    try {
        await procurementService.createPurchaseRequest(payload);
        // alert("Purchase Request created successfully!"); // Better to use a Toast
        router.push("/procurement/request");
    } catch (error) {
        console.error("Failed to create PR:", error);
        setErrors({ submit: "Failed to create purchase request. Please check your inputs." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectedEmployee = employees.find((e) => e.id === formData.requested_by);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/procurement/request">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Purchase Request</h1>
          <p className="text-muted-foreground mt-1">Fill out the PR form completely.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. General Info & Requestor */}
            <Card>
              <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>PR Date *</Label>
                        <Input type="date" value={formData.pr_date} onChange={e => setFormData({...formData, pr_date: e.target.value})} className={errors.pr_date ? "border-red-500" : ""} />
                    </div>
                    <div className="space-y-2">
                        <Label>Date Needed</Label>
                        <Input type="date" value={formData.date_needed} onChange={e => setFormData({...formData, date_needed: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Requested By *</Label>
                    <Select value={formData.requested_by} onValueChange={(val) => {
                        const emp = employees.find(e => e.id === val);
                        setFormData(prev => ({ ...prev, requested_by: val, department: emp ? emp.department : "" }));
                    }}>
                        <SelectTrigger className={errors.requested_by ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                        {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input value={formData.department} disabled className="bg-gray-50" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Section / Unit</Label>
                        <Input value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} placeholder="e.g. IT Support" />
                    </div>
                    <div className="space-y-2">
                        <Label>Delivery Location</Label>
                        <Input value={formData.delivery_location} onChange={e => setFormData({...formData, delivery_location: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                  <Label>Purpose *</Label>
                  <Textarea rows={3} value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className={errors.purpose ? "border-red-500" : ""} />
                </div>
              </CardContent>
            </Card>

            {/* 2. Funding & Procurement Details */}
            <Card>
                <CardHeader><CardTitle>Funding & Mode</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fund Source *</Label>
                            <Select value={formData.fund_source} onValueChange={val => setFormData({...formData, fund_source: val})}>
                                <SelectTrigger className={errors.fund_source ? "border-red-500" : ""}><SelectValue placeholder="Select Source" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MOOE">MOOE</SelectItem>
                                    <SelectItem value="SEF">SEF</SelectItem>
                                    <SelectItem value="Special Education Fund">Special Education Fund</SelectItem>
                                    <SelectItem value="Canteen Fund">Canteen Fund</SelectItem>
                                    <SelectItem value="Donation">Donation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fund Cluster</Label>
                            <Input value={formData.fund_cluster} onChange={e => setFormData({...formData, fund_cluster: e.target.value})} placeholder="e.g. 01" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Procurement Mode *</Label>
                            <Select value={formData.procurement_mode} onValueChange={val => setFormData({...formData, procurement_mode: val})}>
                                <SelectTrigger className={errors.procurement_mode ? "border-red-500" : ""}><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Small Value Procurement">Small Value Procurement</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Public Bidding">Public Bidding</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>PPMP Reference</Label>
                            <Input value={formData.ppmp_reference} onChange={e => setFormData({...formData, ppmp_reference: e.target.value})} placeholder="Ref Code" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Estimated Budget (Allocation)</Label>
                        <Input type="number" step="0.01" value={formData.estimated_budget} onChange={e => setFormData({...formData, estimated_budget: e.target.value})} />
                    </div>
                </CardContent>
            </Card>

            {/* 3. Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4 relative bg-gray-50/50">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">Item #{index + 1}</h4>
                        {items.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0" onClick={() => removeItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                        {/* First Row: Codes and Basic Info */}
                        <div className="col-span-3 space-y-1">
                            <Label className="text-xs">Item Code</Label>
                            <Input className="h-8" value={item.item_code} onChange={e => updateItem(item.id, "item_code", e.target.value)} />
                        </div>
                        <div className="col-span-6 space-y-1">
                            <Label className="text-xs">Description *</Label>
                            <Input className={`h-8 ${errors[`item_${index}_desc`] ? "border-red-500" : ""}`} value={item.item_description} onChange={e => updateItem(item.id, "item_description", e.target.value)} />
                        </div>
                        <div className="col-span-3 space-y-1">
                            <Label className="text-xs">Category</Label>
                            <Input className="h-8" value={item.category} onChange={e => updateItem(item.id, "category", e.target.value)} />
                        </div>

                        {/* Second Row: Specs (Full Width) */}
                        <div className="col-span-12 space-y-1">
                            <Label className="text-xs">Specifications</Label>
                            <Input className="h-8" placeholder="Brand, Model, Color, etc." value={item.specifications} onChange={e => updateItem(item.id, "specifications", e.target.value)} />
                        </div>

                        {/* Third Row: Quantities and Costs */}
                        <div className="col-span-2 space-y-1">
                             <Label className="text-xs">Qty *</Label>
                             <Input type="number" className="h-8" value={item.quantity} onChange={e => updateItem(item.id, "quantity", e.target.value)} />
                        </div>
                        <div className="col-span-2 space-y-1">
                             <Label className="text-xs">Unit *</Label>
                             <Input className="h-8" placeholder="pcs" value={item.unit_of_measure} onChange={e => updateItem(item.id, "unit_of_measure", e.target.value)} />
                        </div>
                        <div className="col-span-3 space-y-1">
                             <Label className="text-xs">Unit Cost *</Label>
                             <Input type="number" step="0.01" className="h-8" value={item.unit_cost} onChange={e => updateItem(item.id, "unit_cost", e.target.value)} />
                        </div>
                        <div className="col-span-3 space-y-1">
                             <Label className="text-xs">Total Cost</Label>
                             <div className="h-8 flex items-center px-3 bg-gray-100 rounded text-sm font-medium">
                                {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_cost) || 0))}
                             </div>
                        </div>

                         {/* Fourth Row: Inventory Stats */}
                         <div className="col-span-3 space-y-1">
                             <Label className="text-xs text-muted-foreground">Stock On Hand</Label>
                             <Input type="number" className="h-8 bg-white" value={item.stock_on_hand} onChange={e => updateItem(item.id, "stock_on_hand", e.target.value)} />
                        </div>
                        <div className="col-span-3 space-y-1">
                             <Label className="text-xs text-muted-foreground">Monthly Cons.</Label>
                             <Input type="number" className="h-8 bg-white" value={item.monthly_consumption} onChange={e => updateItem(item.id, "monthly_consumption", e.target.value)} />
                        </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Items</span>
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Grand Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(calculateTotal())}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  Submit Request
                </Button>
                <Link href="/procurement/request" className="block">
                    <Button variant="outline" className="w-full" type="button">Cancel</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}