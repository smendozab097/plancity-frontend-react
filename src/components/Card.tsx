import type { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const Card = ({ title, subtitle, children }: CardProps) => {
  return (
    <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-heading">
          {title}
        </h2>
        <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
};

export default Card;