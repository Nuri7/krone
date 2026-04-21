import { SITE } from '@/lib/siteData';

export default function Legal() {
  return (
    <div className="bg-charcoal pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-10">Legal Notice & Privacy Policy</h1>
        
        <section className="mb-12">
          <h2 className="font-display text-2xl text-ivory mb-4">Impressum (Legal Notice)</h2>
          <div className="text-ivory/40 font-body text-sm space-y-2 leading-relaxed">
            <p><strong className="text-ivory/60">Krone Langenburg by Ammesso</strong></p>
            <p>{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}<br />{SITE.address.country}</p>
            <p>Phone: {SITE.phone}<br />Email: {SITE.email}</p>
            <p>VAT-ID: Available on request<br />Register: Available on request</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-2xl text-ivory mb-4">Privacy Policy</h2>
          <div className="text-ivory/40 font-body text-sm space-y-4 leading-relaxed">
            <p>We take the protection of your personal data very seriously. This privacy policy informs you about how we handle your data when you visit our website.</p>
            <h3 className="text-ivory/60 font-medium text-base">Data Collection</h3>
            <p>When you use our contact or reservation forms, we collect the information you provide (name, email, phone number, message). This data is used solely to process your request.</p>
            <h3 className="text-ivory/60 font-medium text-base">Cookies</h3>
            <p>Our website may use cookies for essential functionality. No tracking or advertising cookies are used without your explicit consent.</p>
            <h3 className="text-ivory/60 font-medium text-base">Third-Party Services</h3>
            <p>We use Google Maps for location display and Beds24 for hotel bookings. These services may collect data according to their own privacy policies.</p>
            <h3 className="text-ivory/60 font-medium text-base">Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. Contact us at {SITE.email} for any data-related requests.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
