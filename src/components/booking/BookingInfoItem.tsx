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
      <h3 
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </h3>
      <p className="text-gray-600 font-['Lora']">{description}</p>
    </div>
  );
}