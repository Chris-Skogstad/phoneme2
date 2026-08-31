type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="w-full max-w-2xl mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}