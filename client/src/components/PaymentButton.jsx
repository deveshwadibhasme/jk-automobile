import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function PaymentButton({ module_id }) {
  const { token } = useAuth();

  if (token === null) {
    return (
      <Link
        className="mt-4 px-6 py-2 rounded-md text-white bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        to={"/login"}
        state={{ link: "/module-info/" + module_id }}
      >
        Login to make payment
      </Link>
    );
  }

  const { Razorpay } = useRazorpay();

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const RAZORPAY_KEY_ID = "rzp_test_uKcZGSMuN7tEhw";

  const handlePayment = async () => {
    if (token === null) {
      alert("Register or LogIn to make this payment");
    }
    try {
      const response = await axios.post(
        `${url}/payment/check-out`,
        JSON.stringify({ id: module_id }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const [order, userInfo] = await response.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "J.K. Automobiles",
        description: "Pay to download",
        order_id: order.id,
        handler: async (response) => {
          const body = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          try {
            await axios
              .post(`${url}/payment/verify-payment`, JSON.stringify(body), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(async () => {
                const response = await axios.get(
                  `${url}/bin/download-bin/${userInfo.id}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                window.location.href = response.data.url;
              });
            alert("Payment successful!");
          } catch (err) {
            alert("Payment failed: " + err.message);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.mobile_no,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzpay = new Razorpay(options);
      rzpay.open(options);
    } catch (err) {
      alert("Error creating order: " + err.message);
    }
  };

  return (
    <button
      className="mt-4 px-6 py-2 rounded-md text-white bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
      onClick={handlePayment}
    >
      Pay and Download
    </button>
  );
}
