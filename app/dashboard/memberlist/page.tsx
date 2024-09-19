"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  _id: string;
  name: string;
  branch: string;
  rollNumber: string;
  image: string;
  batch: number;
  position: string;
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/dashlogin'); // Redirect to login if not authenticated
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/list')
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
        setError('Error fetching members');
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: string) => {
    // Redirect to edit page
    router.push(`/dashboard/memberlist/editmember?id=${id}`);
  };

  const handleDelete = (id: string) => {
    // Make a request to delete the member
    fetch(`/api/list/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete member');
        }
        // Update state to remove deleted member
        setMembers((prevMembers) => prevMembers.filter((member) => member._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting member:', error);
        setError('Error deleting member');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div key={member._id} className="bg-white shadow-md rounded-lg p-4">
          <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-t-lg" />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-gray-600">{member.position}</p>
            <p className="text-gray-600">{member.branch}, {member.rollNumber}</p>
            <p className="text-gray-600">Batch: {member.batch}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(member._id)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
