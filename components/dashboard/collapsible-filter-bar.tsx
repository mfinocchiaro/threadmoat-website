"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterToolbar } from "./filter-toolbar";
import { useFilter } from "@/contexts/filter-context";

const STORAGE_KEY = "dashboard-filters-collapsed";

export function CollapsibleFilterBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { activeFilterCount } = useFilter();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  if (!mounted) {
    return (
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2 px-3 sm:px-6 py-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2 px-3 sm:px-6 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="h-8 w-8 p-0 flex items-center justify-center gap-1.5"
            title="Expand filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="h-4 min-w-[16px] px-1 text-[10px] font-semibold">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center gap-2 px-3 sm:px-6 py-2 border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="h-8 w-auto px-2 flex items-center justify-center gap-1.5"
          title="Collapse filters"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs">Collapse</span>
        </Button>
      </div>
      <FilterToolbar />
    </div>
  );
}
