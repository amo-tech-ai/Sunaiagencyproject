import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A211F] text-[#F1EEEA] flex-col justify-between p-12">
        <div>
          <a
            href="/"
            className="text-2xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Sun AI Agency
          </a>
        </div>
        <div className="max-w-md">
          <h1
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Transform your business with AI
          </h1>
          <p
            className="text-lg opacity-80"
            style={{ fontFamily: "Lora, serif" }}
          >
            Join hundreds of companies using AI-powered systems to automate
            operations, increase revenue, and deliver exceptional customer
            experiences.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-[#84CC16]">500+</div>
              <div className="text-sm opacity-60">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#84CC16]">98%</div>
              <div className="text-sm opacity-60">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#84CC16]">50+</div>
              <div className="text-sm opacity-60">Industries</div>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-40">
          &copy; {new Date().getFullYear()} Sun AI Agency
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F1EEEA]">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
