import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gmvmax-rules';

/**
 * 规则开关的 localStorage 持久化（P2）。
 * 记录 {[ruleId]: boolean}，初始化时合并默认值与已存储值。
 */
export function useRuleToggle(defaults: Record<string, boolean>) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => {
    const merged: Record<string, boolean> = { ...defaults };
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, boolean>;
          Object.keys(parsed).forEach((k) => {
            merged[k] = parsed[k];
          });
        }
      } catch {
        // 忽略损坏的存储，回退到默认值
      }
    }
    return merged;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledMap));
  }, [enabledMap]);

  const toggle = (ruleId: string) => {
    setEnabledMap((prev) => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  return { enabledMap, toggle };
}
