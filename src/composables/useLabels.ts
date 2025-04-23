import type { Label } from '../stores/account';

export const useLabels = () => {
  const parseLabels = (labelString: string): Label[] => {
    if (!labelString.trim()) return [];
    return labelString.split(';')
      .map(text => text.trim())
      .filter(text => text)
      .map(text => ({ text }));
  };

  const getLabelsAsString = (labels: Label[]): string => {
    return labels.map(label => label.text).join(';') || '';
  };

  return {
    parseLabels,
    getLabelsAsString
  };
}; 