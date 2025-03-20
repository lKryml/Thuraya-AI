import { Mic } from 'lucide-react';

export default function VoiceCall() {
  return (
    <div>
      <button type="button" className="text-white hover:text-gray-300">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
}
