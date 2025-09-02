import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary-foreground">
      <Image
        src="/logo.png"
        width={42}
        height={42}
        alt="ReflectAI Logo"
      />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">Journely</h1>
        <span className="text-xs py-2 font-serif">
          A journal that grows with the journey
        </span>
      </div>
    </div>
  );
}
