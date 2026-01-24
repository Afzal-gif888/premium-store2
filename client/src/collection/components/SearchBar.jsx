import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';

const SearchBar = ({ onSearch, suggestions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchTerm?.trim()?.length > 0) {
      const filtered = suggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered?.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [searchTerm, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
        </div>
        <Input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 md:pl-12 pr-10 md:pr-12"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <Icon name="X" size={16} color="var(--color-muted-foreground)" />
          </button>
        )}
      </div>
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-lg border border-border max-h-64 overflow-y-auto z-20">
          <div className="p-2">
            <p className="px-3 py-2 text-xs md:text-sm font-medium text-muted-foreground" style={{ fontFamily: 'var(--font-cta)' }}>
              Suggestions
            </p>
            {filteredSuggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left text-sm md:text-base text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Icon name="Search" size={14} color="var(--color-muted-foreground)" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;