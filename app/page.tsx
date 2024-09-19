import Image from "next/image";
import Landing from "./components/Landing";

export default function Home() {
  return (
    <div className="bg-white text-7xl">
      Home page
      <Landing />
    </div>
  );
}
