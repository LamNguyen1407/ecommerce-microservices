"use client"

import { ShippingFormInputs } from "@repo/types"
import { PaymentElement } from "@stripe/react-stripe-js/checkout";
import { useCheckout } from "@stripe/react-stripe-js/checkout"
import { ConfirmError } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const CheckoutForm = ({shippingForm} : {shippingForm: ShippingFormInputs}) => {

    const checkoutState = useCheckout() as any;
    // safe access: checkout may be undefined initially
    const checkout = checkoutState?.checkout;
    const { updateShippingAddress, updateEmail, confirm } = checkout ?? {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ConfirmError | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkout) {
            // not ready yet
            return;
        }

        setLoading(true);
        try {
            if (updateEmail) {
                await updateEmail(shippingForm.email);
            }
            if (updateShippingAddress) {
                await updateShippingAddress({
                    name: "shipping_address",
                    address: {
                        line1: shippingForm.address,
                        city: shippingForm.city,
                        country: "US",
                    }
                });
            }

            if (!confirm) {
                throw new Error("Payment confirm function not available yet");
            }

            const res = await confirm();
            if (res.type === 'error') {
                setError(res.error);
            } else {
                // success handling (redirect / show message) if needed
            }
        } catch (err: any) {
            setError({ message: err.message } as ConfirmError);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        console.log("Checkout State:", checkoutState);
    },[checkoutState])

    // show waiting UI until checkout object is ready
    if (!checkout) {
        return <div>Initializing payment...</div>
    }

  return (
    <form onSubmit={handleSubmit}>
        <PaymentElement options={{layout: 'accordion'}} />
        <button type="submit" disabled={loading || !confirm}>
            {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && <div className="text-red-500 mt-4">{error.message}</div>}
    </form>
  )
};

export default CheckoutForm
