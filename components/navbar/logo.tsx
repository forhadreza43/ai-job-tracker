import Image from 'next/image';
import { logo } from '@/components/navbar/navbar.constants';

export default function Logo() {
  return (
    <Image
      src={logo.url}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
    />
  )
}
