interface PageHeaderProps {
  title: string;
  description: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

export default function PageHeader({
  title,
  description,
  maxWidth = '2xl',
}: PageHeaderProps) {
  return (
    <div className="mb-16">
      <h1 className="text-4xl md:text-5xl tracking-tight mb-6">{title}</h1>
      <p className={`text-lg text-gray-600 ${MAX_WIDTH_CLASSES[maxWidth]}`}>
        {description}
      </p>
    </div>
  );
}
