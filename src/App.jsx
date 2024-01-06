
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";

// This value is from the props in the UI
const style = { "layout": "horizontal", "shape": "pill", "color": "silver", height: 48, "tagline": "false" };

// function createOrder() {
//   // replace this url with your server
//   return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/create-order", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       // use the "body" param to optionally pass additional order information
//       // like product ids and quantities
//       body: JSON.stringify({
//           cart: [
//               {
//                   sku: "1blwyeo8",
//                   quantity: 2,
//               },
//           ],
//       }),
//   })
//       .then((response) => response.json())
//       .then((order) => {
//           // Your code here after create the order
//           return order.id;
//       });
// }
function onApprove(data) {
    // replace this url with your server
    return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderID: data.orderID,
        }),
    })
        .then((response) => response.json())
        .then((orderData) => {
            // Your code here after capture the order
        });
}
const handleApprove = (orderID) => {
    alert(`Order ${orderID} is approved`)
}
// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner }) => {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: "Test",
                                amount: {
                                    value: 500
                                }
                            }
                        ]
                    })
                }}
                onApprove={async (data, actions) => {
                    const orderID = await actions.order.capture();
                    console.log(orderID);
                    handleApprove(data.orderID)
                }}
            />
        </>
    );
}
export default function App() {
    return (
        <>
            <div style={{ maxWidth: "750px", minHeight: "200px" }}>
                <PayPalScriptProvider options={{ clientId: "AQR6nVPkxtk1yf1YwvbW72pDv2wKjqNGV1t6hLwuxKkSLtBPUAKqJ92LNzVEBuVpfElZWTavvBdnTH4P", components: "buttons", currency: "USD" }}>
                    <ButtonWrapper showSpinner={false} />
                </PayPalScriptProvider>
            </div>


        </>
    );
}