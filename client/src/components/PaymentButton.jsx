import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function PaymentButton({ module_id }) {
  const { token } = useAuth();

  if (!token) {
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
  const navigate = useNavigate();

  const RAZORPAY_KEY_ID = "rzp_test_SMngUYBcHEMnGI";

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `https://jk-backend.onthewifi.com/api/v1/payment/check-out`,
        { id: module_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("payment Response" , response)

      if (response.data.statusCode === 200) {
        const { order, user } = response.data.data;

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "J.K. Automobiles",
          description: "Pay to download",
          order_id: order.id,
          handler: async (razorpayResponse) => {
            const body = {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            };

            try {
              const verifyResponse = await axios.post(
                `https://jk-backend.onthewifi.com/api/v1/payment/verify-payment`,
                body,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyResponse.data.statusCode === 200) {
                const orderId = verifyResponse.data.data.orderId;

                // Updated download API endpoint
                const downloadResponse = await axios.get(
                  `https://jk-backend.onthewifi.com/api/v1/bin/download-bin/${module_id}/${orderId}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                // Get the download URL from response data
                if (downloadResponse.data.statusCode === 200) {
                  window.location.href = downloadResponse.data.data.url;
                  alert("Payment successful! Your download will start shortly.");
                }
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.mobileNo,
          },
          notes: {
            address: "J.K. Automobiles",
            module_id: module_id,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
      }
    } catch (err) {
      console.error("Payment error:", err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Error creating order. Please try again later.");
      }
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