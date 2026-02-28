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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm mb-2 font-['Lora'] font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full border border-gray-300 px-4 py-3 text-sm font-['Lora'] focus:outline-none focus:border-[#84CC16] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-2 font-['Lora'] font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className="w-full border border-gray-300 px-4 py-3 text-sm font-['Lora'] focus:outline-none focus:border-[#84CC16] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm mb-2 font-['Lora'] font-medium">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={onChange}
          className="w-full border border-gray-300 px-4 py-3 text-sm font-['Lora'] focus:outline-none focus:border-[#84CC16] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm mb-2 font-['Lora'] font-medium">
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={onChange}
          required
          className="w-full border border-gray-300 px-4 py-3 text-sm font-['Lora'] focus:outline-none focus:border-[#84CC16] transition-colors"
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
        <label htmlFor="message" className="block text-sm mb-2 font-['Lora'] font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={5}
          className="w-full border border-gray-300 px-4 py-3 text-sm font-['Lora'] focus:outline-none focus:border-[#84CC16] transition-colors"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#84CC16] text-gray-900 px-8 py-4 text-base font-semibold hover:bg-[#73b512] transition-colors font-['Lora']"
      >
        Submit Request
      </button>
    </form>
  );
}