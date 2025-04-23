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

    updateAccount(account: Account) {
      const index = this.accounts.findIndex(a => a.id === account.id);
      if (index !== -1) {
        this.accounts[index] = account;
      }
    },
    parseLabels(labelString: string): Label[] {
      if (!labelString.trim()) return [];
      return labelString.split(';')
        .map(text => text.trim())
        .filter(text => text)
        .map(text => ({ text }));
    }
  },

  persist: true
});