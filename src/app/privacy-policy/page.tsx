export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy for Snipkit</h1>
      <p className="text-muted-foreground mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to Snipkit! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, username, and email address, that you voluntarily give to us when you register with the Service.
            </li>
            <li>
              <strong>User Content:</strong> Code snippets, descriptions, and other content you upload to our service. Public snippets are accessible to anyone, while private snippets are restricted to you.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Create and manage your account.</li>
            <li>Host, display, and share your code snippets as directed by you.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Disclosure of Your Information</h2>
          <p>We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes.</p>
          <p className="mt-2">We may share information we have collected about you in certain situations:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, or to protect the rights, property, and safety of others.
            </li>
            <li>
             <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data storage.
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at bharatpanigrahi225@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
} 