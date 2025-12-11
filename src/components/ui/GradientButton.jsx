import { Link } from "react-router-dom";

export function GradientButton() {
  return (
    <Link
      to="/login"
      className="inline-block px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-br from-[#391EC4] to-[#4F34D9] shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
    >
      Get Started
    </Link>
  );
}

export function ToHeroButton() {
  return (
    <Link to="/" className="inline-block px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-br from-[#391EC4] to-[#4F34D9] shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300">Hero</Link>
  );
}
export default GradientButton;
