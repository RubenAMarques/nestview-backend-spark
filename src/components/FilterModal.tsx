
import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Colors, Fonts, Spacing, BorderRadius } from '@/theme/tokens';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    status: 'all',
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      areaMin: '',
      areaMax: '',
      status: 'all',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full bg-gray-900 rounded-t-3xl max-h-[80vh] overflow-hidden animate-slide-in-right"
        style={{ backgroundColor: Colors.card }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-6 border-b border-gray-800">
          <div>
            <h2 
              className="text-2xl font-semibold text-white"
              style={{ ...Fonts.display, fontSize: '24px' }}
            >
              Filter Properties
            </h2>
            <p className="text-gray-400 text-sm mt-1">Find your perfect match</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Price Range */}
          <div>
            <Label className="text-white font-medium mb-3 block">Price Range (EUR)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-white font-medium mb-3 block">Bedrooms</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white font-medium mb-3 block">Bathrooms</Label>
              <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Area Range */}
          <div>
            <Label className="text-white font-medium mb-3 block">Area (m²)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min area"
                value={filters.areaMin}
                onChange={(e) => setFilters(prev => ({ ...prev, areaMin: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Input
                type="number"
                placeholder="Max area"
                value={filters.areaMax}
                onChange={(e) => setFilters(prev => ({ ...prev, areaMax: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-white font-medium mb-3 block">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="approved">Available</SelectItem>
                <SelectItem value="pending">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
