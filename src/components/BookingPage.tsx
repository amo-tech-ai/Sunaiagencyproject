import BookingForm from './booking/BookingForm';
import BookingInfoItem from './booking/BookingInfoItem';
import { useBookingForm } from '../lib/hooks/useBookingForm';
import { SERVICE_OPTIONS, BOOKING_INFO } from '../lib/constants';

export default function BookingPage() {
  const { formData, handleChange, handleSubmit } = useBookingForm();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Info Column */}
        <div>
          <h1 className="text-4xl md:text-5xl tracking-tight mb-6">
            Book a Call
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Let's discuss your project and explore how we can help.
          </p>

          <div className="space-y-6">
            {BOOKING_INFO.map((info, index) => (
              <BookingInfoItem
                key={index}
                title={info.title}
                description={info.description}
              />
            ))}
          </div>
        </div>

        {/* Form Column */}
        <div>
          <BookingForm
            formData={formData}
            services={SERVICE_OPTIONS}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
