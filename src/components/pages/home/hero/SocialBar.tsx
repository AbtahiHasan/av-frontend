import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const SocialBar = () => {
  return (
    <div className="absolute left-0 bottom-4 flex justify-center mt-8 space-x-4 text-white bg-white/60 backdrop-blur-md px-4 lg:px-8 py-2 rounded-tr-lg rounded-br-lg">
      <Link
        href="https://www.facebook.com/share/182B8bbSLb/?mibextid=wwXIfr"
        target="_blank"
        className="hover:text-gray-200 bg-violet p-1 lg:p-1.5 rounded-md"
      >
        <Facebook className="w-3 h-3 md:w-4 md:h-4" />
      </Link>
      <Link
        href="https://www.instagram.com/anonymousvoices_av?igsh=bnEzNWw5OXBpb2lq"
        target="_blank"
        className="hover:text-gray-200 bg-violet p-1 lg:p-1.5 rounded-md"
      >
        <Instagram className="w-3 h-3 md:w-4 md:h-4" />
      </Link>
      <Link
        href="https://www.linkedin.com/company/anonymous-voices/"
        target="_blank"
        className="hover:text-gray-200 bg-violet p-1 lg:p-1.5 rounded-md"
      >
        <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
      </Link>
      {/* <Link href="#" className="hover:text-gray-200 bg-violet p-1 lg:p-1.5 rounded-md">
      </Link> */}
    </div>
  );
};
