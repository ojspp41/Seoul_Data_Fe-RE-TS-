import { create } from 'zustand';

interface Birth {
  year: string;
  month: string;
  day: string;
}

interface UserState {
  birth: Birth;
  gender: string;
  email: string;
  nickname: string;
  setBirth: (birth: Birth) => void;
  setGender: (gender: string) => void;
  setEmail: (email: string) => void;
  setNickname: (nickname: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  birth: { year: '', month: '', day: '' },
  gender: '',
  email: '',
  nickname: '',
  setBirth: (birth) => set({ birth }),
  setGender: (gender) => set({ gender }),
  setEmail: (email) => set({ email }),
  setNickname: (nickname) => set({ nickname }),
}));

export default useUserStore;
