"use client"

import Navigation from "../../(home)/components/Navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleAccessPortal = () => {
    router.push('/authentication');
  };

  return <Navigation onAccessPortal={handleAccessPortal} />;
}
