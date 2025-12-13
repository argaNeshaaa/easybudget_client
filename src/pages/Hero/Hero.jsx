import GradientButton from "../../components/ui/GradientButton";
import "../../assets/styles/global.css";
function Hero() {
  return (
    <>
        <div className="z-4 w-full h-full">
          <div className="z-5 w-full h-[50%] flex items-end justify-center">
            <h1 className="tittleHero font-cheese text-[3.5rem] sm:text-[7rem] lg:text-[10rem]">Easy Busedd</h1>
          </div>
          <div className="z-5 w-full h-[50%] flex flex-col items-center justify-start">
            <p className="w-full sm:w-[50%] lg:w-[30%] pt-[3rem] text-center font-gabarito text-[1.2rem] text-[#000000]">
              Master Your Money. Seamlessly manage personal budgets and business
              finances in one powerful hub.
            </p>
            <div className="mt-20">
            <GradientButton />
            </div>
          </div>
        </div>
    </>
  );
}

export default Hero;
