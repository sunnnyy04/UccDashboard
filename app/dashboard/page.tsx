"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberForm from '../components/MemberForm';
import MemberList from '../components/MemberList';
import Link from 'next/link'; // Import Link for navigation
import Gallery from '../components/Gallery';
import NoticeForm from '../components/NoticeUpload/page';

export default function Dashboard() {
  const [members, setMembers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/dashlogin'); // Redirect to login if not authenticated
    }
  }, [router]);

  const handleAddMember = (member: any) => {
    setMembers([...members, member]);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
    <header className="bg-white shadow mb-6">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 " >Dashboard</h1>
        <Link href="/dashboard/memberlist" className=" bg-blue-500">
          Member List
        </Link>
      </div>
    </header>

    <div className="container mx-auto space-y-8">
      <MemberForm />
      <Gallery />
      <NoticeForm />
    </div>
  </div>
  );
}
