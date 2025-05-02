import { Users } from "lucide-react";

export default function PlayerRangeIndicator() {
  return (
    <div className="absolute top-4 right-4 z-50 border-2  border-amber-400 text-yellow-300 px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 retro-font">
      <Users className="h-4 w-4" />
      <div className="flex items-center">
        <span className="text-lg font-bold">3</span>
        <span className="mx-1">–</span>
        <span className="text-lg font-bold">8</span>
        <span className="ml-1 text-xs">joueurs</span>
      </div>
    </div>
  );
}
