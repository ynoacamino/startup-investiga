import FacebookIcon from '@/components/icons/FacebookIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import { Linkedin, Mail, MapIcon, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
  return (
    <div className="w-full bg-[#161439] text-white">
      <div className="container md:container py-2 flex flex-row items-center justify-between ">
        <div className="flex flex-row gap-4">
          <div className="hidden md:flex flex-row gap-2">
            <MapIcon size="16" />
            <span className="text-xs">Arequipa, Perú</span>
          </div>
          <div className="flex flex-row gap-2">
            <Mail size="16" />
            <span className="text-xs">soporte@investiga.com</span>
          </div>
        </div>
        <div className="flex flex-row gap-4 ">
          <div className="hidden md:flex flex-row gap-2 ">
            <PhoneCall size="16" />
            <span className="text-xs">+51 958 756 870</span>
          </div>
          <div className="flex flex-row gap-2">
            <span className="text-xs text-right">Siguenos en:</span>
            <Link href="https://www.facebook.com/investiga">
              <FacebookIcon className="w-4 h-4" />
            </Link>
            <Link href="https://www.facebook.com/investiga">
              <Linkedin className="w-4 h-4" />
            </Link>
            <Link href="https://www.facebook.com/investiga">
              <TwitterIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
