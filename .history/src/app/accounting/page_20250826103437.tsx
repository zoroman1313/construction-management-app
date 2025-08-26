'use client';

export default function AccountingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-center">Accounting Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-600 mb-4">
            Accounting features are being set up. This will include:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• 💳 Transactions management</li>
            <li>• 👥 Team management</li>
            <li>• 📦 Materials tracking</li>
            <li>• 🧰 Tools inventory</li>
            <li>• 🏦 Banking & contracts</li>
            <li>• 📄 Invoices & projects</li>
          </ul>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}