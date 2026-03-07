// C-B01 — Booking Form
// BCG design system: charcoal text, green accents, Georgia serif labels, 4px radius

import { BookingFormData } from '../../lib/hooks/useBookingForm';

interface BookingFormProps {
  formData: BookingFormData;
  services: readonly string[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BookingForm({
  formData,
  services,
  onChange,
  onSubmit,
}: BookingFormProps) {
  const inputClass =
    'w-full border px-4 py-3 text-sm focus:outline-none transition-colors';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className={inputClass}
          style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#1A1A1A' }}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className={inputClass}
          style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#1A1A1A' }}
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={onChange}
          className={inputClass}
          style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#1A1A1A' }}
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={onChange}
          required
          className={inputClass}
          style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#1A1A1A' }}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={5}
          className={inputClass}
          style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#1A1A1A' }}
        />
      </div>

      <button
        type="submit"
        className="w-full px-8 py-4 text-sm transition-colors"
        style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
      >
        Submit Request
      </button>
    </form>
  );
}
