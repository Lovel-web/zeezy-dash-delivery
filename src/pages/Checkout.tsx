import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    estateOrHotel: "",
    phoneNumber: "",
  });

  const estates = [
    "FUTA Estate",
    "Alagbaka Estate",
    "Oba Ile Estate",
    "Presidential Hotel",
    "Elizade University",
    "Other"
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to continue</h1>
          <Button onClick={() => navigate("/auth")}>Go to Login</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    navigate("/products");
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'd like to place an order:\n\n${cart
      .map((item) => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
      .join("\n")}\n\nTotal: ${formatPrice(getTotalPrice())}\n\nDelivery to: ${formData.deliveryAddress}\nEstate/Hotel: ${formData.estateOrHotel}\nPhone: ${formData.phoneNumber}`;
    
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deliveryAddress || !formData.estateOrHotel || !formData.phoneNumber) {
      toast.error("Please fill all delivery details");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          delivery_address: formData.deliveryAddress,
          estate_or_hotel: formData.estateOrHotel,
          phone_number: formData.phoneNumber,
          total_amount: getTotalPrice(),
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Order placed successfully!");
      
      // Redirect to Paystack (placeholder for now)
      toast.info("Paystack payment integration coming soon!");
      navigate("/");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estate">Estate/Hotel</Label>
                    <Select
                      value={formData.estateOrHotel}
                      onValueChange={(value) => setFormData({ ...formData, estateOrHotel: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select estate or hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        {estates.map((estate) => (
                          <SelectItem key={estate} value={estate}>
                            {estate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Place Order & Pay"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleWhatsAppOrder}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Order via WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💳 <strong>Payment:</strong> Paystack integration (placeholder - will be connected)
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    🚚 <strong>Delivery:</strong> Within 2-4 hours in Akure
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
