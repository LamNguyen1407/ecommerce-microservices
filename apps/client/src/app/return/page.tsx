import Link from "next/link";

const ReturnPage = async ({ searchParams }: { searchParams?: { session_id?: string }}) => {

    const session_id = (await searchParams)?.session_id;

    if(!session_id){
        return <div>No session ID provided</div>
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
  return (
    <div>
        <p>Payment: {data.status}</p>
        <p>Payment status: {data.paymentStatus}</p>
        <Link href="/orders">See your orders</Link>
    </div>
  )
}

export default ReturnPage