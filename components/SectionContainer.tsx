type SectionContainerProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionContainer({
  id,
  children,
  className = ""
}: SectionContainerProps) {
  return (
    <section id={id} className={`px-6 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
