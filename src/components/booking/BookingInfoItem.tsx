// C-B02 — Booking Info Item
// BCG design system: Georgia serif title, charcoal text

interface BookingInfoItemProps {
  title: string;
  description: string;
}

export default function BookingInfoItem({
  title,
  description,
}: BookingInfoItemProps) {
  return (
    <div>
      <h3 className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
        {title}
      </h3>
      <p style={{ color: '#6B6B63' }}>{description}</p>
    </div>
  );
}
