import React, { useState } from 'react';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { useSplit } from './SplitContext';
import { getAvatarColor, getInitials } from './splitUtils';

interface PeopleManagerProps {
  className?: string;
}

/**
 * PeopleManager allows users to manage group order participants.
 * Includes adding friends with auto-cycled colors and removing members.
 */
export const PeopleManager: React.FC<PeopleManagerProps> = ({ className = '' }) => {
  const { people, addPerson, removePerson } = useSplit();
  const [nameInput, setNameInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    if (people.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already in the group.`);
      return;
    }

    addPerson(trimmed);
    setNameInput('');
    setErrorMsg('');
  };

  return (
    <div
      id="split-people-panel"
      className={`rounded-xl border border-[#262626] bg-[#111111] p-3.5 space-y-3 anim-fade-in ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#FFD60A]" />
          <h4 className="font-sora text-xs font-bold text-[#F5F5F5]">
            Group Participants
          </h4>
        </div>
        <span className="font-mono text-[10px] text-[#A3A3A3]">
          {people.length === 1 ? '1 Person' : `${people.length} People`}
        </span>
      </div>

      {/* People Pill List */}
      <ul
        role="list"
        className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#262626 transparent',
        }}
      >
        {people.map((person) => {
          const color = getAvatarColor(person.colorIndex);
          const initials = getInitials(person.name);
          const isRemovable = people.length > 1 && !person.isYou;

          return (
            <li
              key={person.id}
              className="flex items-center gap-1.5 rounded-full border bg-[#171717] pl-1 pr-2 py-1 transition-colors shrink-0"
              style={{ borderColor: color.border }}
            >
              {/* Avatar Initial Swatch */}
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                }}
                aria-hidden="true"
              >
                {initials}
              </div>

              {/* Name */}
              <span className="font-mono text-xs font-medium text-[#F5F5F5]">
                {person.name}{' '}
                {person.isYou && (
                  <span className="text-[#737373] text-[10px]">(You)</span>
                )}
              </span>

              {/* Remove button for added participants */}
              {isRemovable && (
                <button
                  type="button"
                  onClick={() => removePerson(person.id)}
                  aria-label={`Remove ${person.name} from group`}
                  className="press-scale ml-0.5 rounded-full p-0.5 text-[#737373] hover:text-rose-400 hover:bg-[#262626] focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add Person Input Form */}
      <form onSubmit={handleAdd} className="space-y-1.5 pt-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Add friend's name (e.g. Meera)..."
            maxLength={24}
            className="flex-1 min-w-0 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-1.5 font-mono text-xs text-[#F5F5F5] placeholder-[#525252] focus:border-[#FFD60A] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD60A] transition-colors"
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            aria-label="Add person to group"
            className="press-scale shrink-0 flex items-center gap-1 rounded-lg bg-[#FFD60A] px-3 py-1.5 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {errorMsg && <p className="font-mono text-[10px] text-rose-400">{errorMsg}</p>}
      </form>
    </div>
  );
};
