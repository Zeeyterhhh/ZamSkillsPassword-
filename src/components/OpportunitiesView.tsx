import React, { useState, useEffect } from 'react';
import { Opportunity, SKILL_CATEGORIES, ZAMFARA_LGAS, SkillCategory } from '../types';
import { fetchJson } from '../lib/api';
import { Briefcase, MapPin, Search, Filter, ArrowRight, Building2, Sparkles } from 'lucide-react';

interface OpportunitiesViewProps {
  onSelectOpportunity: (opp: Opportunity) => void;
  initialCategoryFilter?: string;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  onSelectOpportunity,
  initialCategoryFilter
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedLga, setSelectedLga] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadOpportunities = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedLga !== 'All') params.append('lga', selectedLga);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (searchQuery) params.append('search', searchQuery);

    fetchJson<{ opportunities: Opportunity[] }>(`/api/opportunities?${params.toString()}`)
      .then((data) => setOpportunities(data.opportunities))
      .catch((err) => console.error('Failed to load opportunities:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedLga, selectedCategory, searchQuery]);

  const filtered = opportunities.filter((o) => {
    if (selectedType !== 'All' && o.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Zamfara Employment & Skills Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Discover Jobs, Internships & Apprenticeships
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
          Connect directly with verified local employers across all 14 LGAs in Zamfara State. Apply with your verified Digital Skills Passport.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter by LGA Location</label>
          <select
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="All">All 14 LGAs in Zamfara</option>
            {ZAMFARA_LGAS.map((lga) => (
              <option key={lga} value={lga}>{lga} LGA</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter by Skill Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="All">All 13 Skill Fields</option>
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Opportunity Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="All">All Types</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="training">Training Program</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Search Key Terms</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Solar, Web, Tailoring..."
              className="w-full border border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

      </div>

      {/* Opportunity Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Loading active opportunities in Zamfara...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No matching opportunities found</p>
          <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              onClick={() => onSelectOpportunity(opp)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                    opp.type === 'job' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {opp.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-800">{opp.stipendOrSalary}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{opp.employerName}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills.map((sk) => (
                    <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {opp.lga} LGA
                </span>
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <span>View & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
