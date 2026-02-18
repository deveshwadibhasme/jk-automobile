export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Terms & Conditions
        </h1>

        {/* Section 1 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            1. Digital Product Purchase
          </h2>
          <h3 className="font-medium text-gray-600 mb-2">No Returns</h3>
          <p className="text-gray-600 leading-relaxed">
            All sales are final. Once a file is purchased and downloaded, it
            cannot be returned, exchanged, or refunded. Please ensure you review
            the product details carefully before making a purchase.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            2. Download Assistance
          </h2>
          <h3 className="font-medium text-gray-600 mb-2">Download Support</h3>
          <p className="text-gray-600 leading-relaxed">
            If you experience any issues or difficulties with downloading your
            purchased digital product, please reach out to us for assistance.
            Contact us via WhatsApp at{" "}
            <span className="font-medium">[8087612366]</span> for prompt
            support. We aim to resolve any download-related concerns as quickly
            as possible.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            3. General Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to update these terms and conditions at any
            time. Any changes will be communicated via email or website
            notification.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            By continuing to use the site and make purchases after such updates,
            you accept the revised terms.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            4. Contact Information
          </h2>
          <p className="text-gray-600 mb-2">
            For questions or clarifications regarding these terms or your
            purchase, feel free to contact us via our support channels:
          </p>

          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <p>
              <span className="font-medium">Email:</span> []
            </p>
            <p>
              <span className="font-medium">WhatsApp:</span> [8087612366]
            </p>
          </div>
        </section>

        {/* Notice */}
        <div className="border-t pt-6 mt-6">
          <p className="text-gray-700 font-medium">Important Notice</p>
          <p className="text-gray-600 mt-2">
            By completing your purchase, you confirm that you have read,
            understood, and agree to these terms.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>© 2026 J.K Auto Electronic Work. All rights reserved.</p>
          <p className="italic mt-1">
            Crafted with precision for automotive excellence
          </p>
        </div>
      </div>
    </div>
  );
}
