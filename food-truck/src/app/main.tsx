"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Main = () => {
    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    return (
        <div>
        </div>
    );
};

export default Main;
