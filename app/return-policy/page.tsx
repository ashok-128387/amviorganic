export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return, Refund & Cancellation Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              At AMVI ORGANICS, we are committed to delivering premium-quality organic products with the utmost care. If you experience any issue with your order, please review our policy below.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Orders may be cancelled only before they have been shipped.</li>
                <li>• Once an order has been dispatched, cancellation requests cannot be accepted.</li>
                <li>• If a cancellation request is approved, the full order amount will be refunded to the original payment method.</li>
                <li>• Refunds are generally processed within 5–7 business days.</li>
                <li>• AMVI ORGANICS reserves the right to cancel any order due to stock unavailability, pricing errors, payment issues, suspected fraudulent activity, or other operational reasons.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns & Replacements</h2>
              <p className="text-gray-700 mb-4">
                <strong>Due to the nature of food products, all products are generally sold on a non-returnable basis.</strong>
              </p>
              <p className="text-gray-700 mb-4">However, replacement or refund requests may be considered in the following cases:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Product received in damaged condition.</li>
                <li>• Wrong product delivered.</li>
                <li>• Product received with tampered or opened packaging.</li>
                <li>• Missing items in the shipment.</li>
                <li>• Genuine product quality concerns verified by AMVI ORGANICS.</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Requests must be raised within <strong>48 hours of delivery</strong> by emailing <a href="mailto:contact@amviorganics.com" className="text-green-700 hover:underline">contact@amviorganics.com</a> along with the relevant order details.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Documentation</h3>
              <p className="text-gray-700 mb-2">To process a claim, customers may be required to provide:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Photographs of the product and package.</li>
                <li>• Invoice or order details.</li>
                <li>• Relevant videos or supporting evidence.</li>
                <li>• A clear, unedited unboxing video (for damaged, tampered, incorrect, or missing-item claims).</li>
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> All return, replacement, and refund requests are subject to verification and approval by AMVI ORGANICS. AMVI ORGANICS reserves the right to reject claims where sufficient evidence is not provided or where the claim is found to be fraudulent, misleading, or inconsistent with the order records.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refunds</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Approved refunds will be processed to the original payment method used during purchase unless otherwise determined by AMVI ORGANICS.</li>
                <li>• Refunds are generally completed within 5–7 business days after approval. Actual credit timelines may vary depending on the payment provider or bank.</li>
                <li>• Shipping charges, if any, are non-refundable unless the error was caused by AMVI ORGANICS.</li>
                <li>• Refunds or replacements will not be provided for products that have been used, partially consumed, improperly stored, or damaged after delivery.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">For any questions regarding cancellations, returns, replacements, or refunds, please contact us at:</p>
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