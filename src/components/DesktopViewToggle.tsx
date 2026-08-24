import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Smartphone, MonitorPlay } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const DesktopViewToggle = () => {
  const isMobile = useIsMobile();
  const [isFoldable, setIsFoldable] = useState(false);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    
    if (isFoldable) {
      root.classList.add('foldable-view');
    } else {
      root.classList.remove('foldable-view');
    }
  }, [isFoldable]);

  // Hide entirely on actual mobile devices
  if (isMobile) return null;

  const toggleButton = (
    <div className="fixed bottom-6 right-6 z-[999999]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsFoldable(!isFoldable)}
              className="bg-white text-primary p-3 rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              {isFoldable ? <Smartphone size={24} /> : <MonitorPlay size={24} />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isFoldable ? 'Switch to Phone View' : 'Switch to Foldable View'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return createPortal(toggleButton, document.body);
};
