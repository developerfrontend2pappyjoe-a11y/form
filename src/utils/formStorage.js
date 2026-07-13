export const STORAGE_KEY = "userFormList";

export const getSavedFormList = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed) return [{ ...parsed, id: Date.now() }];
    }

    const legacySaved = localStorage.getItem("userFormData");
    if (legacySaved) {
      const parsed = JSON.parse(legacySaved);
      if (parsed) return [{ ...parsed, id: Date.now() }];
    }

    return [];
  } catch {
    return [];
  }
};

export const saveFormList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
