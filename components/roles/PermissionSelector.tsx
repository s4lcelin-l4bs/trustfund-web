'use client'

import { PermissionModuleGroup } from '@/types'
import { Checkbox } from '@/components/ui/Checkbox'

interface PermissionSelectorProps {
  groups: PermissionModuleGroup[]
  selectedKeys: string[]
  onChange: (keys: string[]) => void
}

export function PermissionSelector({ groups, selectedKeys, onChange }: PermissionSelectorProps) {
  const allKeys = groups.flatMap((g) => g.permissions.map((p) => p.key))
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.includes(k))
  const someSelected = selectedKeys.length > 0 && !allSelected

  function toggleKey(key: string) {
    onChange(
      selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key]
    )
  }

  function toggleGroup(group: PermissionModuleGroup) {
    const groupKeys = group.permissions.map((p) => p.key)
    const allGroupSelected = groupKeys.every((k) => selectedKeys.includes(k))
    onChange(
      allGroupSelected
        ? selectedKeys.filter((k) => !groupKeys.includes(k))
        : Array.from(new Set([...selectedKeys, ...groupKeys]))
    )
  }

  function toggleAll() {
    onChange(allSelected ? [] : allKeys)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-white/5">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleAll}
          label={<span className="font-bold text-slate-800 dark:text-slate-200">Tout sélectionner</span>}
        />
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          {selectedKeys.length}/{allKeys.length}
        </span>
      </div>

      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
        {groups.map((group) => {
          const groupKeys = group.permissions.map((p) => p.key)
          const groupAllSelected = groupKeys.length > 0 && groupKeys.every((k) => selectedKeys.includes(k))
          const groupSomeSelected = groupKeys.some((k) => selectedKeys.includes(k)) && !groupAllSelected

          return (
            <div key={group.module} className="rounded-xl bg-white/30 dark:bg-white/5 p-4 sm:p-3">
              <Checkbox
                checked={groupAllSelected}
                indeterminate={groupSomeSelected}
                onChange={() => toggleGroup(group)}
                label={
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide">
                    {group.moduleLabel}
                  </span>
                }
                className="mb-3 sm:mb-2.5"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 pl-4 sm:pl-7">
                {group.permissions.map((permission) => (
                  <Checkbox
                    key={permission.key}
                    checked={selectedKeys.includes(permission.key)}
                    onChange={() => toggleKey(permission.key)}
                    label={permission.label}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
