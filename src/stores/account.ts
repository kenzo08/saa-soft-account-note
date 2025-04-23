import { defineStore } from 'pinia';

interface Label {
  text: string;
}

export interface Account {
  id: string;
  label: Label[];
  labelInput?: string;
  accountType: 'LDAP' | 'Local';
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    accounts: [] as Account[]
  }),
  
  actions: {
    addAccount() {
      const newAccount: Account = {
        id: crypto.randomUUID(),
        label: [],
        labelInput: '',
        accountType: 'Local',
        login: '',
        password: ''
      };
      this.accounts.push(newAccount);
    },
  },
});