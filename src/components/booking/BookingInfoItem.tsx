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
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
