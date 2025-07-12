export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Terms of Service for Snipkit</h1>
      <p className="text-muted-foreground mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Snipkit (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, then you do not have permission to access the Service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material (&quot;Content&quot;). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p className="mt-2">
            You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. By posting Content, you grant us the right and license to use, display, and distribute such Content on the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Prohibited Uses</h2>
          <p>You agree not to use the Service:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>To upload or transmit any malicious code.</li>
            <li>To infringe upon the intellectual property rights of others.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including a breach of the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Disclaimer</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at bharatpanigrahi225@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
} 