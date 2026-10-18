// Logo oficial enviada pelo cliente (public/img/logo.png), recortada em círculo.
export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src="/img/logo.png"
      alt="Paralaxe"
      width={150}
      height={150}
      className={`${className} rounded-full object-cover ring-1 ring-papel/20`}
    />
  );
}
