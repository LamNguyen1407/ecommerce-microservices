import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const fetchOrders = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // để luôn lấy dữ liệu mới nhất
    }
  );

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  console.log(orders);

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        You haven’t placed any orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div
                className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </div>
            </div>

            {/* Product List */}
            <div className="divide-y divide-gray-100">
              {order.products.map((p: any, index: number) => (
                <div key={index} className="flex gap-4 py-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {p.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      ${(p.price * p.quantity / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600">
              <div>
                <p>
                  <span className="font-semibold">Shipping:</span>{" "}
                  {order.shippingAddress?.line1 || "N/A"},{" "}
                  {order.shippingAddress?.city || "Unknown"},{" "}
                  {order.shippingAddress?.country}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="font-semibold">Total:</span>{" "}
                <span className="text-lg font-bold text-gray-900">
                  ${(order.amount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
