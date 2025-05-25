// Live Interview Platform Architecture - Main Component

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { VideoCall } from '@/components/video-call';
import { Chat } from '@/components/chat';
import { Proctoring } from '@/components/proctoring';
import { RoleSwitcher } from '@/components/role-switcher';

const CodeEditor = dynamic(() => import('@/components/code-editor'), { ssr: false });

export default function InterviewSessionPage({ params }) {
  const [role, setRole] = useState('candidate');
  const [sessionId, setSessionId] = useState(params.sessionId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      {/* Left Panel: Video + Role Controls */}
      <div className="col-span-1 bg-gray-900 text-white p-4">
        <VideoCall sessionId={sessionId} role={role} />
        <RoleSwitcher role={role} setRole={setRole} />
        <Proctoring sessionId={sessionId} role={role} />
      </div>

      {/* Center Panel: Live Code Editor */}
      <div className="col-span-1 md:col-span-2 p-4">
        <CodeEditor sessionId={sessionId} editable={role === 'candidate'} />
      </div>

      {/* Chat Panel */}
      <div className="hidden md:block col-span-1 bg-gray-100 p-4">
        <Chat sessionId={sessionId} role={role} />
      </div>
    </div>
  );
}
