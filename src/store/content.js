import { create } from 'zustand';

export const useContentStore = create((set, get) => ({
  contents: [],
  searchResults: [],
  isSearching: false,
  MAX_TITLE_LENGTH: 1000,
  MAX_DESCRIPTION_LENGTH: 1000,
  setContents: (contents) => set({ contents }),
  addContent: async (newContent) => {
    const res = await fetch("/api/content/addContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContent),
    })
    const data = await res.json();
    set((state) => ({ contents: [...state.contents, data.data] }));
    return data;
  },
  updateContent: async (updatedContent) => {
    const res = await fetch("/api/content/updateContent", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    })
    const data = await res.json();
    set((state) => ({ contents: state.contents.map(content => content._id === data._id ? data : content) }));
    return data;
  },
  deleteContent: async (updatedContent) => {
    const res = await fetch(`/api/content/deleteContent`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    });
    const data = await res.json();
    set((state) => ({ contents: state.contents.filter(content => content._id !== updatedContent.id) }));
    return data;
  },
  getContents: async () => {
    const res = await fetch("/api/content/getContents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    const visibleContents = data.data.filter(content => content.show === true);
    set({ contents: visibleContents });
  }, 
  getContentsSortedByVoteDesc: async () => {
    const res = await fetch("/api/content/getContentsSortedByVoteDesc", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    const visibleContents = data.data.filter(content => content.show === true);
    set({ contents: visibleContents });
  },
  getContentById: async (id) => {
    const res = await fetch(`/api/content/getContentById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  },
  getContentsByUserId: async (userId) => {
    const res = await fetch(`/api/content/getContents/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data.data;
  },
  searchContents: (searchTerm) => {
    set({ isSearching: true });
    const { contents } = get();
    const filtered = contents.filter(content => 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    set({ searchResults: filtered });
  },
  filterByCountries: (countries) => {
    const { contents } = get();
    const filtered = contents.filter(content => countries.includes(content.country));
    set({ searchResults: filtered });
  },
  // TODO: Implement filterByTags
  filterByTags: (tags) => {
    const { contents } = get();
    const filtered = contents.filter(content => tags.includes(content.tags));
    set({ searchResults: filtered });
  },
  clearSearch: () => set({ 
    searchResults: [],
    isSearching: false
  }),
}));