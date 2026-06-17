type PageHeaderProps = {
  Title: string;
  Description: string;
  buttonText?: string;
  onClick?: () => void;
};

export default function PageHeader({
  Title,
  Description,
  buttonText,
  onClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-8">
      <div>
        <h1 className="text-text-primary mb-1 text-3xl font-normal">{Title}</h1>
        <p className="text-text-primary text-md">{Description}</p>
      </div>
      {buttonText && onClick && (
        <button
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-normal active:scale-95 transition-all shadow-md cursor-pointer hover:bg-hover-primary"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
