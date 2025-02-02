import { BackgroundGradientAnimation } from "@/components/ui/conmbg";
const AuthLayout=({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <BackgroundGradientAnimation className="overflow-hidden flex items-center justify-center min-h-screen">
        <div className='w-[600px] z-10 ld:w-full flex flex-col items-center p-6 ' >
        {children}
        </div>
        <div className='hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden
        relative bg-cream flex-col pt-10 pl-24 gap-3 ' >
            <h2 className='text-gravel md:text-8xl font-bold text-white ' >
                Join Us
            </h2>
            <p className="text-[#8FA1B3] dark:text-white/60 md:text-xl mb-10">
            Empower yourself with personalized RAG insights tailored just for you on our GenAI platform. ....{' '}
          <br />
           Unlock the knowledge you need to make informed decisions and stay ahead effortlessly! 😉
        </p>
        </div>
    </BackgroundGradientAnimation >
  );
}


export default AuthLayout;
