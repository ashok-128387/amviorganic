export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              At AMVI ORGANICS, we strive to deliver your order safely and promptly while maintaining the quality and freshness of our products.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Processing</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Orders are typically processed and dispatched within 1–2 business days after successful payment confirmation.</li>
                <li>• Orders placed on Sundays or public holidays will be processed on the next working day.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Coverage</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• We currently ship across most serviceable PIN codes in India through our trusted logistics partners.</li>
                <li>• Delivery availability may vary depending on courier service coverage.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Timelines</h2>
              <p className="text-gray-700 mb-4">Estimated delivery timelines after dispatch:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• <strong>Metro Cities:</strong> 2–5 business days</li>
                <li>• <strong>Tier-2 & Tier-3 Cities:</strong> 3–7 business days</li>
                <li>• <strong>Remote Locations:</strong> 5–10 business days</li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                Delivery timelines are estimates only and may vary due to weather conditions, public holidays, courier delays, transportation disruptions, or other unforeseen circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Charges</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Free shipping</strong> on orders above ₹1,999.</li>
                <li>• Applicable shipping charges, if any, will be displayed at checkout before payment.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
              <p className="text-gray-700">
                Once your order is shipped, tracking details will be shared via email, SMS, or WhatsApp (where applicable).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Incorrect Address & Failed Deliveries</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Customers are responsible for providing complete and accurate delivery information.</li>
                <li>• If an order is returned due to an incorrect address, failed delivery attempts, refusal to accept delivery, or customer unavailability, additional shipping or re-dispatch charges may apply.</li>
                <li>• AMVI ORGANICS reserves the right to recover actual re-shipping costs for orders returned due to customer-related delivery failures.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged, Incorrect, or Missing Orders</h2>
              <p className="text-gray-700 mb-4">If you receive:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• A damaged package,</li>
                <li>• An incorrect product, or</li>
                <li>• Missing items,</li>
              </ul>
              <p className="text-gray-700 mb-4">
                please contact us within 48 hours of delivery at <a href="mailto:contact@amviorganics.com" className="text-green-700 hover:underline">contact@amviorganics.com</a> along with relevant photographs, videos (if available), and order details.
              </p>
              <p className="text-gray-700">
                All claims are subject to verification and review by AMVI ORGANICS before approval of any replacement or refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Risk & Ownership</h2>
              <p className="text-gray-700">
                Risk and ownership of products pass to the customer upon successful delivery at the shipping address provided during checkout.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delays Beyond Our Control</h2>
              <p className="text-gray-700 mb-4">While we make every effort to ensure timely delivery, AMVI ORGANICS shall not be liable for delays caused by:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Courier partner disruptions,</li>
                <li>• Natural disasters,</li>
                <li>• Extreme weather conditions,</li>
                <li>• Government restrictions,</li>
                <li>• Labor strikes,</li>
                <li>• Transportation interruptions, or</li>
                <li>• Any other events beyond our reasonable control.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">For any shipping-related queries, please contact us at:</p>
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:contact@amviorganics.com" className="text-green-700 hover:underline">contact@amviorganics.com</a>
              </p>
            </section>

            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-green-700">AMVI ORGANICS</h3>
              <p className="text-gray-600 italic">Nature's Trust, Delivered.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}