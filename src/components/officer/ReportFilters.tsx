
"use client";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMMON_DISEASES, ETHIOPIAN_REGIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, XCircle } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

export interface ReportFiltersState {
  region: string;
  disease: string;
  date: Date | undefined;
}

interface ReportFiltersProps {
  filters: ReportFiltersState;
  setFilters: Dispatch<SetStateAction<ReportFiltersState>>;
}

const ALL_REGIONS_VALUE = "__ALL_REGIONS__";
const ALL_DISEASES_VALUE = "__ALL_DISEASES__";

export function ReportFilters({ filters, setFilters }: ReportFiltersProps) {
  const handleResetFilters = () => {
    setFilters({ region: '', disease: '', date: undefined });
  };

  return (
    <div className="p-4 mb-6 bg-card border rounded-lg shadow">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-grow min-w-[150px]">
          <label htmlFor="region-filter" className="block text-sm font-medium text-muted-foreground mb-1">Region</label>
          <Select 
            value={filters.region || ALL_REGIONS_VALUE} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, region: value === ALL_REGIONS_VALUE ? "" : value }))}
          >
            <SelectTrigger id="region-filter">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_REGIONS_VALUE}>All Regions</SelectItem>
              {ETHIOPIAN_REGIONS.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-grow min-w-[150px]">
          <label htmlFor="disease-filter" className="block text-sm font-medium text-muted-foreground mb-1">Disease</label>
          <Select 
            value={filters.disease || ALL_DISEASES_VALUE} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, disease: value === ALL_DISEASES_VALUE ? "" : value }))}
          >
            <SelectTrigger id="disease-filter">
              <SelectValue placeholder="All Diseases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_DISEASES_VALUE}>All Diseases</SelectItem>
              {COMMON_DISEASES.map(disease => (
                <SelectItem key={disease} value={disease}>{disease}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-grow min-w-[150px]">
          <label htmlFor="date-filter" className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-filter"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => setFilters(prev => ({ ...prev, date: date || undefined }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button onClick={handleResetFilters} variant="ghost" className="text-muted-foreground hover:text-destructive">
          <XCircle className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>
    </div>
  );
}

