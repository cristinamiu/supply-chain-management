import Link from "next/link";
import containerPic from "../public/supply-chain.png";
import Image from "next/image";

function Navbar() {
  return (
    <header>
      <nav>
        <div className="logo">
          <div>
            <Image src={containerPic} alt="Container Image" height={50} />
            <span>Supply Chain Client</span>
          </div>
        </div>
        <Link href="/">Home</Link>
      </nav>
    </header>
  );
}

export default Navbar;
