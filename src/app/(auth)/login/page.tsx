import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/login_final.jpg"
          alt="Estética Vero'S"
          className="h-full w-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-[#f8e9ec]/90" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden md:flex w-1/2 items-center px-16">
          <div className="max-w-md text-white animate-in fade-in duration-1000"></div>
        </div>

        <div className="flex w-full md:w-1/2 items-center justify-center px-6 md:px-12">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="rounded-[40px] bg-white/80 backdrop-blur-lg p-2 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}