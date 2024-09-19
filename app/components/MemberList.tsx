// app/components/MemberList.tsx
import React from 'react';

interface Member {
  name: string;
  branch: string;
  year: string;
  image: string;
  batch: number;
  position: string;
}

const MemberList: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Members</h2>
      <ul className="space-y-4">
        {members.map((member, index) => (
          <li key={index} className="flex items-center space-x-4 border-b pb-4">
            <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p>{member.branch} - {member.year} - Batch {member.batch}</p>
              <p>Position: {member.position}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
