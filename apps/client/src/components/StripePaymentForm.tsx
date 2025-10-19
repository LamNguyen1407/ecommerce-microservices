"use client"
import { useAuth } from "@clerk/nextjs";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";
const stripe = loadStripe("pk_test_51SJ9z29uTM0YfWGtvsz3J8jEpohDAiJt8df4h4RNEAeW1v1o9s7ndYcct745ZFs9nZRoDj0WESc3bdvzh629ukSf006Aint08l");

const fetchClientSecret = async (cart: CartItemsType ,token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`, {
        method: 'POST',
        body: JSON.stringify({cart}),
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
}


const StripePaymentForm = ({shippingForm} : {shippingForm: ShippingFormInputs}) => {
    const {cart} = useCartStore();
    const [token, setToken] = useState<string|null>(null);
    const [clientSecret, setClientSecret] = useState<string|null>(null);
    const {getToken} = useAuth();

    useEffect(() => {
        const load = async() => {
            const token = await getToken();
            if(token) {
                setToken(token);
                const secret = await fetchClientSecret(cart,token);
                setClientSecret(secret);
            }
        }
        load()
    },[])

    if (!token) {
        return <div>Loading...</div>
    }

    if (!clientSecret) {
        return <div>Loading payment details...</div>
    }

  return (
    <CheckoutProvider
      stripe={stripe}
      options={{clientSecret}}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  )
}

export default StripePaymentForm